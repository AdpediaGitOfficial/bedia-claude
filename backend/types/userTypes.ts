import { Document } from 'mongoose';

export interface IUsers extends Document {
  fullName: string;
  mobileNumber: number;
  dob: Date;
  userType?: 'child' | 'teenager' | 'adult';
  email?: string;
  parentName?: string;
  parentDob?: Date;
  avatar?: string;
  otp?: string;
  mobileNumberVerified?: boolean;
  isDeleted?: boolean;
  gender?: string;
  interest?: string;
  status?: number;
  password?: string;
  role?: string;
  currentStudentId?: string;
  fixedOtp?: string;
  isActive: boolean;
}

export interface IUserAuth extends Document {
  userId: string;
  deviceId: string;
  deviceType: string;
  authToken: string;
  isActive: boolean;
}

export interface IUserBody {
  fullName?: string;
  mobileNumber: number;
  dob: Date;
  userType?: 'child' | 'teenager' | 'adult';
  email?: string;
  parentName?: string;
  parentDob?: Date;
  gender?: string;
  status?: number;
  role?: string;
  interest?: string;
  currentStudentId?: string;
  otp?: string;
  isActive?: boolean;
}

export interface IOtpBody {
  mobileNumber: number;
  otp: string;
  deviceId: string;
  deviceType: 'web' | 'mobile';
  type?: string;
  fixedOtp?: string;
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IAdminBody {
  fullName?: string;
  mobileNumber: number;
  email?: string;
  gender?: string;
  status?: number;
  role?: string;
  password?: string;
}

export interface IUserDobBody {
  userId: string;
  parentDobYear: number;
  parentName: string;
}

export interface IDobBody {
  userId: string;
  parentDob: Date;
  parentName: string;
}

export interface IUserCount {
  totalUsers: number;
  totalStudents: number;
  registeredThisMonth: number;
  subscribedThisMonth: number;
  freeUsersThisMonth: number;
}
