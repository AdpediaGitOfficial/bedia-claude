import { Schema, model } from 'mongoose';
import { ITestimonialModel } from '../../types/testimonialTypes';

const testimonialSchema = new Schema<ITestimonialModel>(
  {
    content: { type: String, required: true },
    author: { type: String, required: true },
    designation: { type: String },
    authorImage: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const testimonialModel = model<ITestimonialModel>('testimonial', testimonialSchema);
export default testimonialModel;
