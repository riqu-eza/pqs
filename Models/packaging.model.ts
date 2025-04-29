// models/Thinner.ts
import mongoose from 'mongoose';

const packagingSchema = new mongoose.Schema({
  litres: { type: Number, required: true },
});

export const Packaging = mongoose.models.Packaging || mongoose.model('Packaging', packagingSchema);
