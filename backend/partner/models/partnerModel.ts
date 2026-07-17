import { Schema, model } from 'mongoose';
import { IPartnerModel } from '../../types/partnerTypes';

const partnerSchema = new Schema<IPartnerModel>(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const partnerModel = model<IPartnerModel>('partner', partnerSchema);
export default partnerModel;
