import { Schema, model } from 'mongoose';
import { IUserModel } from '../../types/authTypes';

const userSchema = new Schema<IUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    designation: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const userModel = model<IUserModel>('user', userSchema);
export default userModel;
