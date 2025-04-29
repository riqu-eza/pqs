import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ip: String,
  userAgent: String,
  valid: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
