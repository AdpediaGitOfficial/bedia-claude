import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createCommentUseCase,
  deleteCommentByIdUseCase,
  getCommentsByPostIdUseCase,
  likeCommentUseCase,
  unlikeCommentUseCase,
  updateCommentByIdUseCase,
} from '../useCases/commentUseCase';
import {
  IAuthUser,
  ICommentBody,
  ICommentUpdateBody,
  IGetCommentsQuery,
} from '../../types/commentTypes';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

const getAuthUser = (req: Request): IAuthUser & { userId: string } => {
  const user = (req as any).user as IAuthUser | undefined;
  if (!user || !user.userId) {
    throw new AppError('Invalid token. User not identified', HttpStatus.UNAUTHORIZED);
  }
  return user as IAuthUser & { userId: string };
};

export const getCommentsByPostId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const comments = await getCommentsByPostIdUseCase(postId, req.query as IGetCommentsQuery);
    res.status(200).json({
      success: true,
      message: 'Fetched All Comments successfully',
      result: comments,
    });
  },
);

export const createComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = getAuthUser(req);
  const data = req.body as ICommentBody;
  await createCommentUseCase(data, user.userId);
  res.status(200).json({
    success: true,
    message: 'Created Comment successfully',
    result: true,
  });
});

export const updateCommentById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = getAuthUser(req);
    const { id } = req.params;
    const data = req.body as ICommentUpdateBody;
    await updateCommentByIdUseCase(id, user.userId, data);
    res.status(200).json({
      success: true,
      message: 'Updated Comment successfully',
      result: true,
    });
  },
);

export const deleteCommentById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = getAuthUser(req);
    const { id } = req.params;
    await deleteCommentByIdUseCase(id, user);
    res.status(200).json({
      success: true,
      message: 'Deleted Comment successfully',
      result: true,
    });
  },
);

export const likeComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = getAuthUser(req);
  const { id } = req.params;
  await likeCommentUseCase(id, user.userId);
  res.status(200).json({
    success: true,
    message: 'Liked Comment successfully',
    result: true,
  });
});

export const unlikeComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = getAuthUser(req);
  const { id } = req.params;
  await unlikeCommentUseCase(id, user.userId);
  res.status(200).json({
    success: true,
    message: 'Unliked Comment successfully',
    result: true,
  });
});
