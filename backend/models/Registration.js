const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticketTier: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  attended: { type: Boolean, default: false },
  checkedInAt: { type: Date },
  uniqueToken: { type: String, unique: true },
  notes: { type: String, default: '' },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema);
