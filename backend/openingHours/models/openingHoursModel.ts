import { Schema, model } from 'mongoose';
import { IOpeningHoursModel } from '../../types/openingHoursTypes';

const openingHoursSchema = new Schema<IOpeningHoursModel>(
  {
    title: { type: String, default: 'Opening Hours' },
    days: { type: String, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const OpeningHoursModel = model<IOpeningHoursModel>('opening_hours', openingHoursSchema);

export default OpeningHoursModel;
