// Models/packaging.model.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IPackaging extends Document {
  litres: number;
}

const packagingSchema = new Schema<IPackaging>({
  litres: { type: Number, required: true },
});

const Packaging: Model<IPackaging> = 
  mongoose.models.Packaging || mongoose.model<IPackaging>('Packaging', packagingSchema);

export default Packaging;