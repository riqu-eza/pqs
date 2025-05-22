// Models/artwork.model.ts
import mongoose, { Document, Model } from 'mongoose';

interface IArtworkColor extends Document {
  name: string;
  colorCode: string[];
}

const artworkColorSchema = new mongoose.Schema<IArtworkColor>({
  name: { type: String, required: true },
  colorCode: { type: [String], required: true },
});

const ArtworkColor: Model<IArtworkColor> = 
  mongoose.models.ArtworkColor || mongoose.model<IArtworkColor>('ArtworkColor', artworkColorSchema);

export default ArtworkColor;