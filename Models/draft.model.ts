// Models/draft.model.ts
import mongoose from 'mongoose';

const DraftSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: Object,
    createdAt: { type: Date, default: Date.now },
  });
  
  export const Draft = mongoose.models.Draft || mongoose.model('Draft', DraftSchema);
  