import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  registerUserUseCase,
  loginUserUseCase,
  verifyTokenUseCase,
  getAllUsersUseCase,
  updateUserByIdUseCase,
  deleteUserByIdUseCase,
  getUserByIdUseCase,
  changePasswordUseCase,
  getDashboardDataUseCase,
} from '../useCases/authUseCase';
import {
  IUpdatePasswordBody,
  IUpdateUserBody,
  IUserLoginBody,
  IUserRegisterBody,
} from '../../types/authTypes';

export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IUserRegisterBody;
  const result = await registerUserUseCase(data);
  res.status(200).json({
    success: true,
    message: 'User created successfully',
    result,
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IUserLoginBody;
  const result = await loginUserUseCase(data);
  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    result,
  });
});

export const verifyToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as { token: string };
  if (!data.token) {
    res.status(400).json({ success: false, message: 'Token is required' });
    return;
  }
  const result = await verifyTokenUseCase(data.token);
  res.status(200).json({ success: true, message: 'Token verified Successfully', result });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await getAllUsersUseCase(req.query);
  res.status(200).json({
    success: true,
    message: 'Fetched all users successfully',
    result,
  });
});

export const getDashboardData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await getDashboardDataUseCase();
  res.status(200).json({
    success: true,
    message: 'Fetched dashboard data successfully',
    result,
  });
});

export const changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IUpdatePasswordBody;
  await changePasswordUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Changed Password successfully',
    result: true,
  });
});
export const updateUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body as IUpdateUserBody;
  await updateUserByIdUseCase(id, data);
  res.status(200).json({
    success: true,
    message: 'Updated User successfully',
    result: true,
  });
});

export const deleteUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteUserByIdUseCase(id);
  res.status(200).json({
    success: true,
    message: 'Deleted User successfully',
    result: true,
  });
});
export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await getUserByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched User successfully',
    result: user,
  });
});
