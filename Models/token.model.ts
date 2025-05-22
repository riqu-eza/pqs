// models/Token.ts
import mongoose, { Document, Model } from 'mongoose';

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expires: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const tokenSchema = new mongoose.Schema<IToken>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Token: Model<IToken> =
  mongoose.models.Token || mongoose.model<IToken>('Token', tokenSchema);
