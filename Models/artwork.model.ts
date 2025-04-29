// models/ArtworkColor.ts
import mongoose from 'mongoose';

const artworkColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  colorCode: { type: String, required: true },
});

export const ArtworkColor = mongoose.models.ArtworkColor || mongoose.model('ArtworkColor', artworkColorSchema);
