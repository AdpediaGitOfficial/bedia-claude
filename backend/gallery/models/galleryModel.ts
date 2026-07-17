import { Schema, model } from 'mongoose';
import { IGalleryModel } from '../../types/galleryTypes';

const gallerySchema = new Schema<IGalleryModel>(
  {
    title: { type: String, required: true },
    images: {
      type: [String],
      required: true,
      validate: [(v: string[]) => v.length > 0, 'At least one image is required'],
    },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const galleryModel = model<IGalleryModel>('gallery', gallerySchema);
export default galleryModel;
