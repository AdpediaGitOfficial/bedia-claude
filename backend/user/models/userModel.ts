import { Schema, model } from 'mongoose';
import { IUsers } from '../../types/userTypes';

const usersSchema = new Schema<IUsers>(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    // dob: { type: Date, required: true },
    // userType: { type: String, enum: ['child', 'teenager', 'adult'], required: true },
    email: { type: String, required: false },
    // parentName: { type: String, default: '' },
    // parentDob: { type: Date, default: '' },
    avatar: { type: String, default: '' },
    otp: { type: String },
    fixedOtp: { type: String, default: '' },
    mobileNumberVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    status: { type: Number, default: 1 },
    password: { type: String, default: '' },
    role: { type: String },
    //  currentStudentId: { type: String, default: '' },
  },
  { timestamps: true },
);

const usersModel = model<IUsers>('Users', usersSchema);
export default usersModel;
