import {
  IGetAllDBQuery,
  IUpdateUserDBBody,
  IUserModel,
  IUserRegisterBody,
} from '../../types/authTypes';
import { ObjectID } from '../../utils/objectIdParser';
import userModel from '../models/userModel';

export const getUsersCount = async (query: IGetAllDBQuery): Promise<number> => {
  return await userModel.countDocuments(query);
};

export const fetchUserByEmail = async (email: string): Promise<IUserModel | null> => {
  const dbQuery = {
    email,
    isDeleted: false,
  };
  return await userModel.findOne(dbQuery).select({ createdAt: 0, updatedAt: 0, __v: 0 }).lean();
};
export const createUser = async (data: IUserRegisterBody): Promise<IUserModel | null> => {
  return await userModel.create(data);
};
export const fetchAllUsers = async (
  query: IGetAllDBQuery,
  skip: number,
  limit: number,
): Promise<IUserModel[]> => {
  return await userModel
    .find(query)
    .select({ password: 0, isDeleted: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchUserById = async (id: string): Promise<IUserModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await userModel
    .findOne(dbQuery)
    .select({ name: 1, email: 1, designation: 1, _id: 0 })
    .lean();
};
export const deleteUserById = async (id: string): Promise<IUserModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await userModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updateUserById = async (
  id: string,
  data: IUpdateUserDBBody,
): Promise<IUserModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await userModel.findOneAndUpdate(dbQuery, data);
};
export const updateUserPassword = async (
  email: string,
  password: string,
): Promise<IUserModel | null> => {
  return await userModel.findOneAndUpdate({ email }, { password });
};
