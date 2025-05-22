// models/Thinner.ts
import mongoose, { Document, Model } from 'mongoose';

export interface IThinner extends Document {
  ratio: number;
}

const thinnerSchema = new mongoose.Schema<IThinner>({
  ratio: { type: Number, required: true },
});

export const Thinner: Model<IThinner> =
  mongoose.models.Thinner || mongoose.model<IThinner>('Thinner', thinnerSchema);
