import { Schema, model } from 'mongoose';
import { IFaqModel } from '../../types/faqTypes';

const faqSchema = new Schema<IFaqModel>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const faqModel = model<IFaqModel>('faq', faqSchema);
export default faqModel;
