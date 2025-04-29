// models/Size.ts
import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  area: { type: Number, required: true },
});

export const Size = mongoose.models.Size || mongoose.model('Size', sizeSchema);
