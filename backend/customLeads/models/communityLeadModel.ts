import { Schema, model } from 'mongoose';
import { IBaseLeadModel } from '../../types/leadsTypes';

const consultationLeadSchema = new Schema<IBaseLeadModel>(
  {},
  {
    strict: false, // dynamic fields
    timestamps: true,
  },
);

const communityLeadModel = model<IBaseLeadModel>('community_lead', consultationLeadSchema);
export default communityLeadModel;
