import { Document, Types } from 'mongoose';

export interface IUserModel extends Document {
  name: string;
  email: string;
  designation?: string;
  password: string;
  role: string;
  isDeleted: boolean;
}
export interface IUserRegisterBody {
  name: string;
  email: string;
  designation?: string;
  password: string;
}
export interface IUserLoginBody {
  email: string;
  password: string;
}

export interface IGetAllQuery {
  search?: string;
  page?: string;
  limit?: string;
}

export interface IUpdateUserBody {
  name: string;
  email: string;
  designation?: string;
  newPassword?: string;
  oldPassword?: string;
}

export interface IUpdatePasswordBody {
  email: string;
  newPassword: string;
  oldPassword: string;
}

export interface IGetAllDBQuery {
  isDeleted: boolean;
  $or?: {
    name?: { $regex: string; $options: string };
    designation?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }[];
}

export interface IUpdateUserDBBody {
  name: string;
  email: string;
  designation?: string;
  password?: string;
}

export interface IUsers extends Document {
  _id: Types.ObjectId;

  name: string;

  email: string;

  password: string;

  role: string;
}
