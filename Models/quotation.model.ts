/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from 'mongoose';

export interface Quotation extends Document {
  formData: any;
  summary: any;
  createdAt: Date;
}

const QuotationSchema = new Schema<Quotation>({
  formData: { type: Schema.Types.Mixed, required: true },
  summary: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Quotation || mongoose.model<Quotation>('Quotation', QuotationSchema);
