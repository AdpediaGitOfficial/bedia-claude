import { Schema, model } from 'mongoose';
import { ITermsAndConditionModel } from '../../types/termsAndConditionTypes';

const termsAndConditionSchema = new Schema<ITermsAndConditionModel>(
  {
    title: {
      type: String,
      required: true, // "Terms & Conditions"
    },

    content: {
      type: String,
      required: true,
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

export default model('terms_and_conditions', termsAndConditionSchema);
