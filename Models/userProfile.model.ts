import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, maxlength: 300 },
  avatar: { type: String },
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  preferences: {
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' }
  }
}, { timestamps: true });

export const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);
