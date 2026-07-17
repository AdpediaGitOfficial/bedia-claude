import {
  fetchUserByEmail,
  createUser,
  getUsersCount,
  fetchAllUsers,
  updateUserById,
  deleteUserById,
  fetchUserById,
  updateUserPassword,
} from '../repos/authRepo';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  IGetAllQuery,
  IUserLoginBody,
  IUserRegisterBody,
  IUpdateUserBody,
  IUserModel,
  IGetAllDBQuery,
  IUpdateUserDBBody,
  IUpdatePasswordBody,
} from '../../types/authTypes';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import configKeys from '../../configKeys';
import { ObjectID } from '../../utils/objectIdParser';
import { getCustomLeadCount } from '../../customLeads/usecases/createCustomleadUseCase';
// import { getCommunitiesCountController } from '../../community/controllers/communitycontroller';
import { getCommunitiesCountUseCase } from '../../community/usecases/community';

// export const registerUserUseCase = async (
//   data: IUserRegisterBody,
// ): Promise<{ token: string; role: string }> => {
//   const { name, email, password, designation } = data;

//   // Check if user already exists
//   const existingUser = await fetchUserByEmail(email);
//   if (existingUser) {
//     throw new AppError('User already exists', HttpStatus.BAD_REQUEST);
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Create new user
//   await createUser({ name, email, designation, password: hashedPassword });

//   // Create JWT token
//   const token = jwt.sign({ email, role: 'user' }, configKeys.JWT_SECRET, {
//     expiresIn: configKeys.JWT_DURATION,
//   });
//   return { token, role: 'user' };
// };

export const registerUserUseCase = async (
  data: IUserRegisterBody,
): Promise<{
  token: string;
  role: string;
  user: {
    userId: string;
    name: string | null;
    email: string | null;
  };
}> => {
  const { name, email, password, designation } = data;

  // Check if user already exists
  const existingUser = await fetchUserByEmail(email);
  if (existingUser) {
    throw new AppError('User already exists', HttpStatus.BAD_REQUEST);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await createUser({
    name,
    email,
    designation,
    password: hashedPassword,
  });

  if (!user) {
    throw new AppError('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Create JWT token
  const token = jwt.sign({ email, role: user.role }, configKeys.JWT_SECRET, {
    expiresIn: configKeys.JWT_DURATION,
  });

  return {
    token,
    role: user.role,
    user: {
      userId: String(user._id),
      name: user.name,
      email: user.email,
    },
  };
};

// export const loginUserUseCase = async (
//   data: IUserLoginBody,
// ): Promise<{ token: string; role: string }> => {
//   const { email, password } = data;

//   // Check if user exists
//   const user = await fetchUserByEmail(email);
//   if (!user) {
//     throw new AppError('User does not exist', HttpStatus.BAD_REQUEST);
//   }

//   // Check password
//   const isPasswordValid = await bcrypt.compare(password, user!.password);
//   if (!isPasswordValid) {
//     throw new AppError('User does not exist pwd', HttpStatus.BAD_REQUEST);
//   }

//   // Create JWT token
//   const token = jwt.sign({ email, role: user!.role }, configKeys.JWT_SECRET, {
//     expiresIn: configKeys.JWT_DURATION,
//   });
//   return { token, role: user!.role };
// };

export const loginUserUseCase = async (
  data: IUserLoginBody,
): Promise<{
  token: string;
  role: string;
  user: {
    userId: string;
    name: string | null;
    email: string | null;
  };
}> => {
  const { email, password } = data;

  /**
   * Check if user exists
   */
  const user = await fetchUserByEmail(email);

  if (!user) {
    throw new AppError('User does not exist', HttpStatus.BAD_REQUEST);
  }

  /**
   * Check password
   */
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid password', HttpStatus.BAD_REQUEST);
  }

  /**
   * Create JWT token
   */

  const token = jwt.sign({ email, role: user!.role }, configKeys.JWT_SECRET, {
    expiresIn: configKeys.JWT_DURATION,
  });

  return {
    token,

    role: user.role,

    user: {
      userId: String(user._id),

      name: user.name,

      email: user.email,
    },
  };
};

export const verifyTokenUseCase = (token: string) => {
  try {
    const decoded = jwt.verify(token, configKeys.JWT_SECRET);
    if (decoded) return true;
    throw new AppError('Invalid token', HttpStatus.UNAUTHORIZED);
  } catch (error) {
    throw new AppError('Invalid token', HttpStatus.UNAUTHORIZED);
  }
};

export const getAllUsersUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: IGetAllDBQuery = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { designation: { $regex: search, $options: 'i' } },
    ]; // Case-insensitive search
  }
  const totalCount = await getUsersCount(query);

  if (!totalCount) return { totalCount: 0, users: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const users = await fetchAllUsers(query, skip, parseInt(limit));
  return { totalCount, users };
};

export const getDashboardDataUseCase = async (): Promise<any> => {
  // No of leads, No of page views, Number of active listings for sales, number of active listings for rent,
  // const query = { isDeleted: false };
  // const leadCount = await getLeadsCount(query);
  const leadCount = await getCustomLeadCount();
  const communityCount = await getCommunitiesCountUseCase();
  const pageViewCount = 0;
  return {
    leadCount,
    pageViewCount,
    communityCount,
  };
};

export const changePasswordUseCase = async (data: IUpdatePasswordBody): Promise<IUserModel> => {
  const { email, oldPassword, newPassword } = data;
  const existingUser = await fetchUserByEmail(email);
  if (!existingUser) {
    throw new AppError('Update Failed. Provide valid data', HttpStatus.BAD_REQUEST);
  }
  const validPassword = await bcrypt.compare(oldPassword, existingUser.password);

  if (!validPassword) {
    throw new AppError('Upload Failed. Provide valid data', HttpStatus.BAD_REQUEST);
  }
  const password = await bcrypt.hash(newPassword, 10);
  const user = await updateUserPassword(email, password);
  if (!user) throw new AppError('Couldn\'t update User', HttpStatus.NOT_FOUND);
  return user;
};

export const updateUserByIdUseCase = async (
  id: string,
  data: IUpdateUserBody,
): Promise<IUserModel> => {
  const { email, designation, name, oldPassword, newPassword } = data;
  if (ObjectID(id)) {
    const existingUser = await fetchUserByEmail(email);
    if (!existingUser) {
      throw new AppError('Update Failed. Cannot update email field', HttpStatus.BAD_REQUEST);
    }
    const body: IUpdateUserDBBody = { email, designation, name };
    if (newPassword && newPassword !== '') {
      if (!oldPassword || oldPassword === '')
        throw new AppError('Upload Failed. Provide valid data', HttpStatus.BAD_REQUEST);

      const validPassword = await bcrypt.compare(oldPassword, existingUser.password);
      if (validPassword) {
        body.password = await bcrypt.hash(newPassword, 10);
      } else throw new AppError('Upload Failed. Provide valid data', HttpStatus.BAD_REQUEST);
    }
    // check for  matching password

    const user = await updateUserById(id, body);
    if (!user) throw new AppError('Couldn\'t update User', HttpStatus.NOT_FOUND);
    return user;
  }
  throw new AppError('No User Found', HttpStatus.NOT_FOUND);
};
export const deleteUserByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const user = await deleteUserById(id);
    // check for  unique value updations
    if (user) return true;
  }
  throw new AppError('No User Found', HttpStatus.NOT_FOUND);
};

export const getUserByIdUseCase = async (query: { _id: string }): Promise<IUserModel> => {
  if (ObjectID(query._id)) {
    const user = await fetchUserById(query._id);
    if (user) return user;
  }
  throw new AppError('No User Found', HttpStatus.NOT_FOUND);
};
