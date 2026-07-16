require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database Schemas
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, role: String,
  phone: { type: String, default: '+91 98765 43210' },
  address: { type: String, default: 'Staff Quarters, Sector-4, Geeta University Campus' },
  emergencyPhone: { type: String, default: '+91 99999 11111' },
  avatarUrl: { type: String, default: null }
});
const User = mongoose.model('User', UserSchema);

const TicketSchema = new mongoose.Schema({
  id: { type: String, unique: true }, block: String, floor: String, room: String,
  type: String, details: String, status: String, completionDate: String
});
const Ticket = mongoose.model('Ticket', TicketSchema);

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, unique: true }, status: String, checkIn: String, verifiedBy: String
});
const Attendance = mongoose.model('Attendance', AttendanceSchema);

// API Endpoints
app.post('/api/users/profile', async (req, res) => {
  const { email, name, role } = req.body;
  let user = await User.findOne({ email });
  if (!user) { user = new User({ email, name, role }); await user.save(); }
  res.json(user);
});

app.put('/api/users/profile', async (req, res) => {
  const updated = await User.findOneAndUpdate({ email: req.body.email }, req.body, { new: true });
  res.json(updated);
});

app.get('/api/tickets', async (req, res) => {
  const tickets = await Ticket.find(req.query.type ? { type: req.query.type } : {});
  res.json(tickets);
});

app.patch('/api/tickets/:id/status', async (req, res) => {
  const completionDate = req.body.status === 'Completed' ? '2026-07-03' : null;
  const updated = await Ticket.findOneAndUpdate({ id: req.params.id }, { status: req.body.status, completionDate }, { new: true });
  res.json(updated);
});

app.get('/api/attendance', async (req, res) => {
  const logs = await Attendance.find().sort({ date: -1 });
  res.json(logs);
});

// Default MongoDB URI local fallback connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hostelconnect';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✓ Connected to MongoDB Successfully'))
  .catch((err) => console.error('✗ MongoDB Connection Error:', err));

app.listen(5000, () => console.log(`🚀 Server running on port 5000`));