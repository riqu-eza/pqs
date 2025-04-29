// models/Size.ts
import mongoose from 'mongoose';

const colorcodeSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  colorCode: { type: Number, required: true },
});

export const Colorcode = mongoose.models.Colorcode || mongoose.model( 'Colorcode', colorcodeSchema);
