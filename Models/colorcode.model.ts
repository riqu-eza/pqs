import mongoose, { Document, Model, Schema } from 'mongoose';

interface IColorcode extends Document {
  colorName: string;
  colorCode: string; // Changed to string
}

const colorcodeSchema = new Schema<IColorcode>({
  colorName: { 
    type: String, 
    required: true,
    trim: true
  },
  colorCode: {
    type: String,
    required: true,
    trim: true,
  }
}, { timestamps: true });

const Colorcode: Model<IColorcode> = 
  mongoose.models.Colorcode || mongoose.model<IColorcode>('Colorcode', colorcodeSchema);

export default Colorcode;