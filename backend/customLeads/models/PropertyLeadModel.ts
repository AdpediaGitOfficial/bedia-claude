import { Schema, model } from 'mongoose';
import { IBaseLeadModel } from '../../types/leadsTypes';

const propertyLeadSchema = new Schema<IBaseLeadModel>(
  {},
  {
    strict: false, // allow dynamic fields
    timestamps: true,
  },
);

const propertyLeadModel = model<IBaseLeadModel>('property_lead', propertyLeadSchema);
export default propertyLeadModel;
