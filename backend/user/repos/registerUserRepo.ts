import { IUserAuth, IUserBody, IUsers, IAdminBody } from '../../types/userTypes';
import { ObjectID } from '../../utils/objectIdParser';
import usersModel from '../models/userModel';
import userAuthModel from '../models/userAuthModel';
import { HttpStatus } from '../../common/httpStatus';
import AppError from '../../common/appError';
import bcrypt from 'bcryptjs';
import { objectIdToString } from '../../utils/objectIdParser';
import { ObjectId } from 'mongodb';

export const checkUserExist = async (email: string): Promise<{ _id: string } | null> => {
  return await usersModel
    .findOne({
      email,
      isDeleted: false,
    })
    .select({ _id: 1 })
    .lean<{ _id: string } | null>();
};

// export const checkUserExist = async (
//   email: string | null,
//   mobileNumber: number,
// ): Promise<{ _id: string; mobileNumberVerified: boolean; currentStudentId: string } | null> => {
//   // const query: any = { mobileNumber };
//   const query: any = {
//     isDeleted: false,
//     mobileNumber,
//   };
//   if (email && email.trim() !== '') {
//     query.$or = [{ email }, { mobileNumber }];
//   }
//   return await usersModel
//     .findOne(query)
//     .select({ _id: 1, mobileNumberVerified: 1, currentStudentId: 1 })
//     .lean();
// };

// export const createUser = async (
//   data: IUserBody,
//   otp: string,
// ): Promise<{ _id: string; otp: string }> => {
//   const user = await usersModel.create({ ...data, otp });
//   return { _id: user._id as string, otp };
// };

export const createUser = async (data: IUserBody): Promise<{ _id: string }> => {
  const user = await usersModel.create({ ...data });
  return { _id: user._id as string };
};

export const verifyOtp = async (
  mobileNumber: number,
  otp: string,
): Promise<{ _id: string } | null> => {
  return await usersModel
    .findOne({ mobileNumber, otp, isDeleted: false })
    .sort({ createdAt: -1 })
    .select({ _id: 1 })
    .lean<{ _id: string } | null>();
};

export const setUserVerified = async (id: string): Promise<{ _id: string } | null> => {
  const _id = ObjectID(id);
  return await usersModel.findOneAndUpdate(
    { _id, isDeleted: false },
    { mobileNumberVerified: true, otp: '' },
    { new: true },
  );
};

export const saveUserToken = async (
  userId: string,
  deviceId: string,
  deviceType: string,
  authToken: string,
): Promise<IUserAuth | null> => {
  const existingSession = await userAuthModel.findOne({
    userId,
    deviceType,
  });
  if (!existingSession) {
    return await userAuthModel.create({ userId, deviceId, deviceType, authToken, isActive: true });
  } else {
    return await userAuthModel.findOneAndUpdate(
      { userId, deviceType, isActive: true },
      { authToken, deviceId },
      { new: true },
    );
  }
};

export const uploadAvatar = async (
  id: string,
  imageUrl: string,
): Promise<{ _id: string } | null> => {
  const _id = ObjectID(id);
  return await usersModel.findOneAndUpdate(
    { _id, isDeleted: false },
    { avatar: imageUrl },
    { new: true },
  );
};

export const checkUserNumberExist = async (
  mobileNumber: number,
  type?: string,
): Promise<{ _id: string; fixedOtp: string } | null> => {
  if (type !== 'register') {
    return await usersModel
      .findOne({ mobileNumber, isDeleted: false, status: 1, mobileNumberVerified: true })
      .select({ _id: 1, fixedOtp: 1 })
      .lean<{ _id: string; fixedOtp: string } | null>();
  }
  return await usersModel
    .findOne({ mobileNumber, isDeleted: false, status: 1 })
    .select({ _id: 1, fixedOtp: 1 })
    .lean<{ _id: string; fixedOtp: string } | null>();
};

export const updateUserOtp = async (
  mobileNumber: number,
  otp: string,
): Promise<{ _id: string } | null> => {
  return await usersModel.findOneAndUpdate(
    { mobileNumber, isDeleted: false, status: 1 },
    { otp: otp },
  );
};

export const getProfile = async (userId: string): Promise<IUsers | null> => {
  return await usersModel.findOne({ _id: userId, isDeleted: false }).lean();
};

export const checkUserIdExist = async (userId: string): Promise<{ _id: string } | null> => {
  const _id = ObjectID(userId);
  return await usersModel
    .findOne({ _id, isDeleted: false })
    .select({ _id: 1 })
    .lean<{ _id: string } | null>();
};

export const updateUser = async (id: string, data: IUserBody): Promise<IUserBody> => {
  const _id = ObjectID(id);
  const obj = { modifiedOn: new Date().toISOString(), ...data };
  const updatedData = await usersModel.findOneAndUpdate({ _id }, obj, { new: true }).lean();
  if (!updatedData) {
    throw new AppError('Something went wrong', HttpStatus.BAD_REQUEST);
  }
  return updatedData;
};

export const checkMobileExist = async (
  mobileNumber: number,
  userId: string,
): Promise<{ _id: string } | null> => {
  return await usersModel
    .findOne({
      mobileNumber,
      _id: { $ne: userId },
    })
    .select({ _id: 1 })
    .lean<{ _id: string } | null>();
};

export const getProfileById = async (userId: string): Promise<IUsers | null> => {
  return await usersModel.findOne({ _id: userId, isDeleted: false }).lean();
};

export const getAllUsers = async (
  filters: Partial<IUserBody>,
  limit: number,
  page: number,
): Promise<{ data: IUsers[]; totalCount: number }> => {
  const query: any = {};
  if (filters.fullName) {
    query.fullName = { $regex: filters.fullName, $options: 'i' }; // Case-insensitive search
  }
  if (filters.mobileNumber) {
    query.mobileNumber = filters.mobileNumber;
  }
  if (filters.status !== undefined) {
    query.status = filters.status;
  }
  if (filters.role) {
    query.role = filters.role;
  }
  query.isDeleted = false;

  const skip = (page - 1) * limit;
  const data: IUsers[] = (await usersModel.find(query).limit(limit).skip(skip).lean()) || [];
  const totalCount: number = await usersModel.countDocuments(query);

  return {
    data,
    totalCount,
  };
};

export const verifyLogin = async (
  email: string,
  password: string,
): Promise<{ _id: string } | null> => {
  const user = await usersModel
    .findOne({ email, isDeleted: false, status: 1 })
    .select({ _id: 1, password: 1 })
    .lean();
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password as string);
  return isMatch ? { _id: objectIdToString(user._id as ObjectId) } : null;
};

//Password hashing for user reg
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const createAdmin = async (data: IAdminBody): Promise<{ _id: string }> => {
  const user = await usersModel.create(data);
  return { _id: user._id as string };
};

export const updateParentDob = async (
  id: string,
  parentDob: Date,
  parentName: string,
): Promise<{ _id: string } | null> => {
  const _id = ObjectID(id);
  return await usersModel.findOneAndUpdate(
    { _id },
    { parentDob: parentDob, parentName },
    { new: true },
  );
};

export const verifyParentDobYear = async (userId: string, year: number): Promise<boolean> => {
  const _id = ObjectID(userId);
  const user = await usersModel.findOne({ _id, isDeleted: false }, { parentDob: 1 });
  if (!user || !user.parentDob) {
    throw new AppError('User or parent DOB not found', HttpStatus.NOT_FOUND);
  }
  const parentDobYear = new Date(user.parentDob).getFullYear();
  return parentDobYear === year;
};

export const updatecurrentStudent = async (
  userId: string,
  studentId: string,
): Promise<{ _id: string } | null> => {
  const _id = ObjectID(userId);
  return await usersModel.findOneAndUpdate(
    { _id, isDeleted: false },
    { currentStudentId: studentId },
    { new: true },
  );
};

export const checkMobileEmailExist = async (
  mobileNumber: number,
  userId: string,
  email: string,
): Promise<{ _id: string } | null> => {
  return await usersModel
    .findOne({
      mobileNumber,
      email,
      _id: { $ne: userId },
    })
    .select({ _id: 1 })
    .lean<{ _id: string } | null>();
};

export const deleteToken = async (
  userId: string,
  deviceType: string,
): Promise<{ _id: string } | null> => {
  const authUserId = ObjectID(userId);
  return await userAuthModel.findOneAndUpdate(
    { userId: authUserId, deviceType },
    { isActive: false, authToken: '' },
    { new: true },
  );
};

export const getUserCount = async (): Promise<number> => {
  try {
    const result = await usersModel.countDocuments({ isDeleted: false, role: 'user' });
    return result;
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw new Error('Failed to fetch user count');
  }
};

export const deleteAccountByUser = async (userId: string): Promise<{ _id: string } | null> => {
  const authUserId = ObjectID(userId);
  const user = await usersModel
    .findOneAndUpdate(
      { _id: authUserId, isDeleted: false },
      { isActive: false, isDeleted: true },
      { new: true },
    )
    .lean();
  if (!user) return null;
  // Update related students
  await usersModel.updateMany(
    { userId: authUserId },
    { $set: { isDeleted: true, isActive: false } },
  );

  return { _id: user._id.toString() };
};

export const fetchUserById = async (id: string): Promise<IUserBody | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await usersModel
    .findOne(dbQuery)
    .select({ avatar: 1, email: 1, mobileNumber: 1, fullName: 1, role: 1, _id: 0 })
    .lean();
};
