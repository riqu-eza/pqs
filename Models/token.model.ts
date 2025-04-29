import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
}, { timestamps: true });

export const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);
