// Models/colorcode.model.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IColorcode extends Document {
  colorName: string;
  colorCode: number;
}

const colorcodeSchema = new Schema<IColorcode>({
  colorName: { type: String, required: true },
  colorCode: { type: Number, required: true },
});

const Colorcode: Model<IColorcode> = 
  mongoose.models.Colorcode || mongoose.model<IColorcode>('Colorcode', colorcodeSchema);

export default Colorcode;