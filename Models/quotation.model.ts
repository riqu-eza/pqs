/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Types, Model } from 'mongoose';

export interface Quotation extends Document {
  formData: any; // You can replace `any` with a more specific type later
  summary: any;  // Same here
  owner: Types.ObjectId;
  createdAt: Date;
}

const QuotationSchema = new Schema<Quotation>({
  formData: { type: Schema.Types.Mixed, required: true },
  summary: { type: Schema.Types.Mixed, required: true },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Fix: Ensure model is cast correctly to avoid union type issues
const QuotationModel: Model<Quotation> =
  mongoose.models.Quotation as Model<Quotation> ||
  mongoose.model<Quotation>('Quotation', QuotationSchema);

export default QuotationModel;
