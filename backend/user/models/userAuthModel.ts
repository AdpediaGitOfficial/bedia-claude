import { Schema, model } from 'mongoose';
import { IUserAuth } from '../../types/userTypes';

const userAuthSchema = new Schema<IUserAuth>(
  {
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    deviceType: { type: String, required: true },
    authToken: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const userAuthModel = model<IUserAuth>('UserAuth', userAuthSchema);
export default userAuthModel;
