// models/Thinner.ts
import mongoose from 'mongoose';

const thinnerSchema = new mongoose.Schema({
  ratio: { type: Number, required: true },
});

export const Thinner = mongoose.models.Thinner || mongoose.model('Thinner', thinnerSchema);
