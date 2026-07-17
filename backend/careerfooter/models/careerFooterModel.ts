import { Schema, model } from 'mongoose';
import { ICareerFooterModel } from '../../types/careerFooterTypes';

const careerFooterSchema = new Schema<ICareerFooterModel>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const careerFooterModel = model<ICareerFooterModel>('careerFooter', careerFooterSchema);
export default careerFooterModel;
