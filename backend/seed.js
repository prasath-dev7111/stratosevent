// StratosEvent — Demo Data Seeder
// Run: node seed.js

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');
dotenv.config();

const User         = require('./models/User');
const Event        = require('./models/Event');
const Registration = require('./models/Registration');
const crypto       = require('crypto');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Event.deleteMany({});
  await Registration.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create users
  const salt        = await bcrypt.genSalt(10);
  const adminPass   = await bcrypt.hash('Admin@2026', salt);
  const userPass    = await bcrypt.hash('User@2026', salt);
  const user2Pass   = await bcrypt.hash('User@2026', salt);

  const admin = await User.create({
    name: 'Admin User', email: 'admin@stratos.com',
    password: adminPass, role: 'admin',
    phone: '+91 98765 00001', organization: 'StratosEvent HQ'
  });

  const user1 = await User.create({
    name: 'Prasanna Kumar', email: 'user@stratos.com',
    password: userPass, role: 'participant',
    phone: '+91 98765 43210', organization: 'Tech Corp India'
  });

  const user2 = await User.create({
    name: 'Ananya Sharma', email: 'ananya@stratos.com',
    password: user2Pass, role: 'participant',
    phone: '+91 91234 56789', organization: 'Infosys Ltd'
  });

  console.log('👤 Created 3 users');

  // Create events
  const now = new Date();

  const event1 = await Event.create({
    title: 'StratosConf 2026 — AI & Future of Work',
    description: 'Join 500+ enterprise leaders, AI researchers, and technology innovators at StratosConf 2026. This flagship conference explores how artificial intelligence is reshaping industries, job markets, and organisational structures. Featuring keynotes, panel discussions, and hands-on workshops led by global experts.',
    category: 'Conference',
    venue: 'Chennai Trade Centre',
    address: 'Nandambakkam Post, Kathipara Junction, Chennai, Tamil Nadu 600089',
    startDate: new Date(now.getTime() + 15 * 86400000),
    endDate:   new Date(now.getTime() + 15 * 86400000 + 8 * 3600000),
    status: 'published',
    isInviteOnly: false,
    createdBy: admin._id,
    tags: ['AI', 'Future of Work', 'Technology', 'Leadership'],
    ticketTiers: [
      { name: 'General', price: 999,  totalSeats: 300, availableSeats: 287, perks: 'Access to all sessions' },
      { name: 'Professional', price: 1999, totalSeats: 150, availableSeats: 134, perks: 'Sessions + Networking lunch' },
      { name: 'VIP', price: 4999, totalSeats: 50, availableSeats: 42, perks: 'All access + Speaker meet & greet' }
    ]
  });

  const event2 = await Event.create({
    title: 'Full Stack Dev Workshop — React & Node.js',
    description: 'An intensive 1-day hands-on workshop covering modern full stack development with React 19 and Node.js 22. Participants will build a complete production-ready application from scratch, covering authentication, REST APIs, database design, and deployment on cloud platforms.',
    category: 'Workshop',
    venue: 'IIT Madras Research Park',
    address: 'Kanagam Road, Taramani, Chennai, Tamil Nadu 600113',
    startDate: new Date(now.getTime() + 7 * 86400000),
    endDate:   new Date(now.getTime() + 7 * 86400000 + 6 * 3600000),
    status: 'published',
    isInviteOnly: false,
    createdBy: admin._id,
    tags: ['React', 'Node.js', 'Full Stack', 'Hands-on'],
    ticketTiers: [
      { name: 'Standard', price: 499, totalSeats: 40, availableSeats: 32, perks: 'Workshop kit + Certificate' },
      { name: 'Premium', price: 999, totalSeats: 15, availableSeats: 8, perks: 'Kit + Certificate + 1-on-1 mentoring' }
    ]
  });

  const event3 = await Event.create({
    title: 'Executive Leadership Webinar — Q3 2026',
    description: 'An exclusive invite-only webinar for C-suite executives and senior managers on navigating digital transformation in 2026. Topics include organisational resilience, data-driven decision making, and building high-performance remote teams.',
    category: 'Webinar',
    venue: 'Online — Zoom',
    address: 'Virtual Event',
    startDate: new Date(now.getTime() + 3 * 86400000),
    endDate:   new Date(now.getTime() + 3 * 86400000 + 2 * 3600000),
    status: 'published',
    isInviteOnly: true,
    createdBy: admin._id,
    tags: ['Leadership', 'Executive', 'Digital Transformation', 'Exclusive'],
    ticketTiers: [
      { name: 'Executive Pass', price: 0, totalSeats: 30, availableSeats: 22, perks: 'Invite-only — subject to approval' }
    ]
  });

  const event4 = await Event.create({
    title: 'Cybersecurity Masterclass 2026',
    description: 'Deep dive into modern cybersecurity threats, zero-trust architecture, and compliance frameworks. Suitable for security engineers, DevSecOps practitioners, and IT managers looking to upskill in 2026 security standards.',
    category: 'Workshop',
    venue: 'Tidel Park, Chennai',
    address: '4, Rajiv Gandhi Salai, Taramani, Chennai, Tamil Nadu 600113',
    startDate: new Date(now.getTime() + 22 * 86400000),
    endDate:   new Date(now.getTime() + 22 * 86400000 + 7 * 3600000),
    status: 'published',
    isInviteOnly: false,
    createdBy: admin._id,
    tags: ['Cybersecurity', 'Zero Trust', 'DevSecOps'],
    ticketTiers: [
      { name: 'Standard', price: 799, totalSeats: 60, availableSeats: 55, perks: 'All sessions + materials' },
      { name: 'VIP', price: 1599, totalSeats: 20, availableSeats: 18, perks: 'All sessions + materials + certification prep' }
    ]
  });

  console.log('📅 Created 4 events');

  // Create sample registrations
  const reg1 = await Registration.create({
    event: event1._id, user: user1._id,
    ticketTier: 'Professional', status: 'approved',
    uniqueToken: crypto.randomBytes(16).toString('hex'),
    attended: false
  });

  const reg2 = await Registration.create({
    event: event2._id, user: user1._id,
    ticketTier: 'Standard', status: 'approved',
    uniqueToken: crypto.randomBytes(16).toString('hex'),
    attended: true, checkedInAt: new Date()
  });

  const reg3 = await Registration.create({
    event: event3._id, user: user1._id,
    ticketTier: 'Executive Pass', status: 'pending',
    uniqueToken: crypto.randomBytes(16).toString('hex'),
    attended: false
  });

  const reg4 = await Registration.create({
    event: event1._id, user: user2._id,
    ticketTier: 'General', status: 'approved',
    uniqueToken: crypto.randomBytes(16).toString('hex'),
    attended: false
  });

  const reg5 = await Registration.create({
    event: event3._id, user: user2._id,
    ticketTier: 'Executive Pass', status: 'pending',
    uniqueToken: crypto.randomBytes(16).toString('hex'),
    attended: false
  });

  console.log('📋 Created 5 sample registrations');

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅  SEED COMPLETE — StratosEvent is ready!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔑  LOGIN CREDENTIALS:');
  console.log('   Admin  → admin@stratos.com  / Admin@2026');
  console.log('   User 1 → user@stratos.com   / User@2026');
  console.log('   User 2 → ananya@stratos.com / User@2026');
  console.log('\n🌐  Open: http://localhost:5000');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
