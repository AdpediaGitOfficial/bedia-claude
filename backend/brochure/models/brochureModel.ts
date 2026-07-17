import { Schema, model } from 'mongoose';
import { IBrochureModel } from '../../types/brochureTypes';

const brochureSchema = new Schema<IBrochureModel>(
  {
    title: { type: String, required: true },
    fileUrl: { type: String },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const brochureModel = model<IBrochureModel>('brochure', brochureSchema);
export default brochureModel;
