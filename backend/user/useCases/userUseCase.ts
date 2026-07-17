import { generateToken, generateTokenUser } from '../../authentication/authentication';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { sendOtp } from '../../services/twilioService';
//import { BrevoService } from '../../services/brevoService';
import { ObjectID } from '../../utils/objectIdParser';

import { IOtpBody, IUserBody, IUsers, ILoginBody, IAdminBody } from '../../types/userTypes';
import {
  checkUserExist,
  createUser,
  saveUserToken,
  setUserVerified,
  verifyOtp,
  checkUserNumberExist,
  updateUserOtp,
  getProfile,
  updateUser,
  //checkMobileExist,
  getProfileById,
  getAllUsers,
  verifyLogin,
  createAdmin,
  hashPassword,
  checkMobileEmailExist,
  deleteToken,
  deleteAccountByUser,
  fetchUserById,
} from '../repos/registerUserRepo';

// export const registerUserUseCase = async (
//   data: IUserBody,
// ): Promise<{ _id: string; otp: string }> => {
//   //  export const registerUserUseCase = async (data: IUserBody): Promise<Pick<IUsers, '_id'>> => {

//   const userExist = await checkUserExist(data.email ?? '', data.mobileNumber);

//   if (userExist) {
//     if (!userExist.mobileNumberVerified) {
//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       await sendOtp(data.mobileNumber, otp);

//       await updateUser(userExist._id as string, { ...data, otp });
//       return { _id: userExist._id as string, otp };
//     } else {
//       throw new AppError('User Mobile Number/Email Already Exist', HttpStatus.BAD_REQUEST);
//     }
//   }
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   await sendOtp(data.mobileNumber, otp);

//   data.status = 1;
//   data.role = 'user';
//   const result = await createUser(data, otp);
//   return result;
// };

export const registerUserUseCase = async (data: IUserBody): Promise<{ _id: string }> => {
  const userExist = await checkUserExist(data.email ?? '');

  if (userExist) {
    throw new AppError('User Email Already Exist', HttpStatus.BAD_REQUEST);
  }
  data.status = 1;
  data.role = 'user';
  const result = await createUser(data);
  return result;
};

export const verifyOtpUseCase = async (
  data: IOtpBody,
): Promise<{ token: string } & Omit<IUserBody, keyof Document>> => {
  const { mobileNumber, otp, deviceId, deviceType } = data;
  const otpCheck = await verifyOtp(mobileNumber, otp);
  if (!otpCheck) throw new AppError('Invalid OTP', HttpStatus.BAD_REQUEST);
  await setUserVerified(otpCheck._id);
  const token = generateToken({ role: 'user', userId: otpCheck._id });
  await saveUserToken(otpCheck._id, deviceId, deviceType, token);
  const result = await getProfileById(otpCheck._id);
  if (!result) throw new AppError('User profile not found', HttpStatus.NOT_FOUND);
  return {
    token,
    ...result,
  } as unknown as { token: string } & Omit<IUserBody, keyof Document>;
};

export const uploadAvatarUseCase = async (
  file: Express.Multer.File,
  studentId: string,
): Promise<string> => {
  //  const imageUrl = await processAndUploadImage(file, 'avatar');
  // const imageUrl = imageUrl;
  // upload the avatar url to db using id from the token
  // const upload = await uploadAvatar(studentId);
  // if (!upload) throw new AppError('Image upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
  return studentId;
};

export const sendOtpUseCase = async (data: IOtpBody): Promise<string> => {
  //check exists
  const userExist = await checkUserNumberExist(data.mobileNumber, data.type);
  if (!userExist) throw new AppError('User Not Found', HttpStatus.BAD_REQUEST);

  //const otp = '112233';

  let otp: string;

  const fixedOtpNumbers = [
    7306548087, 5500111111, 5500111112, 5500111113, 5500111114, 5500111115, 5500111116, 5500111117,
    5500111118, 5500111119, 5500111120, 8089838462, 8157956783, 8921137041, 8281005156, 9495956000,
    9946101989, 9446528172,
  ];

  if (fixedOtpNumbers.includes(data.mobileNumber)) {
    otp = '112233';
  } else if (data.mobileNumber === 9020493835) {
    otp = '123456';
  } else if (data.mobileNumber === 7907723393) {
    otp = '112114';
  } else if (userExist.fixedOtp) {
    otp = userExist.fixedOtp;
  } else {
    otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtp(data.mobileNumber, otp);
  }

  /* OTP Email
  const emailId = 'soniyaej@gmail.com';
  const brevoService = new BrevoService();
  await brevoService.sendEmail(emailId, 'Your OTP Code', `Your OTP is: ${otp}`);
  */
  await updateUserOtp(data.mobileNumber, otp);
  return otp;
};

export const getProfileUseCase = async (userId: string): Promise<IUserBody> => {
  const result = await getProfile(userId);
  if (!result) {
    throw new AppError('No User found for the given user ID', HttpStatus.NOT_FOUND);
  }
  return {
    ...result,
  } as IUserBody;
};

export const updateUserUseCase = async (userId: string, data: IUserBody): Promise<IUserBody> => {
  const chkUser = await getProfile(userId);
  if (!chkUser) {
    throw new AppError('No User found for the given user ID', HttpStatus.NOT_FOUND);
  }
  const chkDataExist = await checkMobileEmailExist(data.mobileNumber, userId, data.email as string);
  if (chkDataExist) throw new AppError('User Mobile Number/Email Exist', HttpStatus.BAD_REQUEST);
  const userData = {
    mobileNumber: data.mobileNumber,
    dob: data.dob,
    email: data.email,
    parentDob: data.parentDob,
    parentName: data.parentName,
    interest: data.interest,
  };
  const result = await updateUser(userId, userData);
  return {
    ...result,
  } as IUserBody;
};

export const getUsersUseCase = async (
  filters: Partial<IUserBody>,
  limit: number,
  page: number,
): Promise<{ data: IUsers[]; totalCount: number }> => {
  const result = await getAllUsers(filters, limit, page);
  if (!result.data || result.data.length === 0) {
    throw new AppError('No Users found', HttpStatus.NOT_FOUND);
  }
  return result;
};

export const loginUseCase = async (
  data: ILoginBody,
): Promise<{ token: string } & Omit<IUserBody, keyof Document>> => {
  const { email, password } = data;
  const check = await verifyLogin(email, password);
  if (!check) throw new AppError('Invalid Email/Password', HttpStatus.BAD_REQUEST);
  const token = generateToken({ role: 'admin', userId: check._id });
  //await saveUserToken(otpCheck._id, deviceId, deviceType, token);
  const result = await getProfileById(check._id);
  if (!result) throw new AppError('User profile not found', HttpStatus.NOT_FOUND);
  return { token, ...result };
};

export const userLoginUseCase = async (
  data: ILoginBody,
): Promise<{ token: string } & Omit<IUserBody, keyof Document>> => {
  const { email, password } = data;
  const check = await verifyLogin(email, password);
  if (!check) throw new AppError('Invalid Email/Password', HttpStatus.BAD_REQUEST);
  const token = generateTokenUser({ role: 'user', userId: check._id });
  const result = await getProfileById(check._id);
  if (!result) throw new AppError('User profile not found', HttpStatus.NOT_FOUND);
  return { token, ...result };
};

export const registerAdminUseCase = async (data: IAdminBody): Promise<Pick<IUsers, '_id'>> => {
  //check userAlready exist
  const userExist = await checkUserExist(data.email ?? '');
  if (userExist)
    throw new AppError('User Mobile Number/Email Already Exist', HttpStatus.BAD_REQUEST);
  data.status = 1;
  data.role = 'admin';
  const hashedPassword = await hashPassword(data.password as string);
  data.password = hashedPassword;
  const result = await createAdmin(data);
  return result;
};

export const logoutUseCase = async (userId: string, deviceType: string): Promise<boolean> => {
  const result = await deleteToken(userId, deviceType);
  if (!result) {
    throw new AppError('Token not found or already invalidated.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return true;
};

export const deleteAccountUseCase = async (userId: string): Promise<boolean> => {
  const result = await deleteAccountByUser(userId);
  if (!result) {
    throw new AppError('Unable to delete account.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return true;
};

export const getUserByIdUseCase = async (query: { _id: string }): Promise<IUserBody> => {
  if (ObjectID(query._id)) {
    const user = await fetchUserById(query._id);
    if (user) return user;
  }
  throw new AppError('No User Found', HttpStatus.NOT_FOUND);
};
