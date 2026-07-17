import { Schema, model } from 'mongoose';
import { IBaseLeadModel } from '../../types/leadsTypes';

const contactLeadSchema = new Schema<IBaseLeadModel>(
  {},
  {
    strict: false, // dynamic fields
    timestamps: true,
  },
);

const contactLeadModel = model<IBaseLeadModel>('contact_lead', contactLeadSchema);
export default contactLeadModel;
