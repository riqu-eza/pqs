// models/Size.ts
import mongoose, { Document, Model } from 'mongoose';

export interface ISize extends Document {
  type: string;
  area: number;
}

const sizeSchema = new mongoose.Schema<ISize>({
  type: { type: String, required: true },
  area: { type: Number, required: true },
});

export const Size: Model<ISize> = mongoose.models.Size || mongoose.model<ISize>('Size', sizeSchema);
