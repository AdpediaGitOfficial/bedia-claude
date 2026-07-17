import { Schema, model } from 'mongoose';
import { IClayTypeModel } from '../../types/clayTypeTypes';

const clayTypeSchema = new Schema<IClayTypeModel>(
  {
    title: { type: String, required: true },
    image: [{ type: String }],
    description: { type: String },
    shortDescription: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const clayTypeModel = model<IClayTypeModel>('clayType', clayTypeSchema);
export default clayTypeModel;
