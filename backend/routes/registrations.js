const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { protect, adminOnly } = require('../middleware/auth');
const crypto = require('crypto');

// POST /api/registrations
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, ticketTier } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status !== 'published') return res.status(400).json({ message: 'Event is not open for registration' });

    const alreadyRegistered = await Registration.findOne({ event: eventId, user: req.user._id });
    if (alreadyRegistered) return res.status(400).json({ message: 'You are already registered for this event' });

    const tier = event.ticketTiers.find(t => t.name === ticketTier);
    if (!tier) return res.status(400).json({ message: 'Invalid ticket tier' });
    if (tier.availableSeats < 1) return res.status(400).json({ message: 'No seats available in this tier' });

    tier.availableSeats -= 1;
    await event.save();

    const uniqueToken = crypto.randomBytes(16).toString('hex');
    const status = event.isInviteOnly ? 'pending' : 'approved';

    const registration = await Registration.create({
      event: eventId, user: req.user._id,
      ticketTier, status, uniqueToken
    });

    await registration.populate('event', 'title startDate venue');
    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/registrations/my
router.get('/my', protect, async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user._id })
      .populate('event', 'title startDate endDate venue category status')
      .sort('-registeredAt');
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/registrations/event/:id (admin)
router.get('/event/:id', protect, adminOnly, async (req, res) => {
  try {
    const regs = await Registration.find({ event: req.params.id })
      .populate('user', 'name email phone organization')
      .populate('event', 'title startDate')
      .sort('-registeredAt');
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/registrations/analytics/:eventId (admin)
router.get('/analytics/:eventId', protect, adminOnly, async (req, res) => {
  try {
    const regs = await Registration.find({ event: req.params.eventId });
    const tierBreakdown = {};
    regs.forEach(r => {
      tierBreakdown[r.ticketTier] = (tierBreakdown[r.ticketTier] || 0) + 1;
    });
    res.json({
      total: regs.length,
      approved: regs.filter(r => r.status === 'approved').length,
      pending: regs.filter(r => r.status === 'pending').length,
      rejected: regs.filter(r => r.status === 'rejected').length,
      attended: regs.filter(r => r.attended).length,
      tierBreakdown
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/registrations/admin/all (admin)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const regs = await Registration.find({})
      .populate('user', 'name email')
      .populate('event', 'title startDate category')
      .sort('-registeredAt')
      .limit(100);
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/registrations/:id/approve (admin)
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const reg = await Registration.findByIdAndUpdate(
      req.params.id, { status: 'approved' }, { new: true }
    ).populate('user', 'name email').populate('event', 'title');
    res.json(reg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/registrations/:id/reject (admin)
router.put('/:id/reject', protect, adminOnly, async (req, res) => {
  try {
    const reg = await Registration.findByIdAndUpdate(
      req.params.id, { status: 'rejected' }, { new: true }
    );
    res.json(reg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/registrations/:id/checkin (admin)
router.put('/:id/checkin', protect, adminOnly, async (req, res) => {
  try {
    const reg = await Registration.findByIdAndUpdate(
      req.params.id,
      { attended: true, checkedInAt: new Date() },
      { new: true }
    ).populate('user', 'name email');
    res.json(reg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
