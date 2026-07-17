import {
  createComment,
  deleteCommentById,
  deleteRepliesByParentId,
  fetchCommentById,
  fetchParentCommentsByPostId,
  fetchRepliesByParentIds,
  getCommentsCount,
  updateCommentById,
} from '../repos/commentRepo';
import {
  addCommentLike,
  getLikesCountByCommentIds,
  removeCommentLike,
} from '../repos/commentLikeRepo';
import { fetchBlogById } from '../../blog/repos/blogRepo';
import {
  IAuthUser,
  ICommentBody,
  ICommentModel,
  ICommentUpdateBody,
  IGetCommentsQuery,
} from '../../types/commentTypes';
import { Types } from 'mongoose';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

const formatComment = (comment: any, likesCountMap: Record<string, number>): any => ({
  _id: comment._id,
  postId: comment.postId,
  parentId: comment.parentId,
  comment: comment.comment,
  user: comment.userId,
  likesCount: likesCountMap[comment._id.toString()] || 0,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
});

export const getCommentsByPostIdUseCase = async (
  postId: string,
  queryParams: IGetCommentsQuery,
): Promise<any> => {
  if (!ObjectID(postId)) {
    throw new AppError('No Post Found', HttpStatus.NOT_FOUND);
  }
  const { page = '1', limit = '10' } = queryParams;
  const query = { postId: ObjectID(postId), parentId: null, isDeleted: false };

  const totalCount = await getCommentsCount(query);
  if (!totalCount) return { totalCount: 0, comments: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const parentComments = await fetchParentCommentsByPostId(postId, skip, parseInt(limit));

  const parentIds = parentComments.map((comment) => comment._id as Types.ObjectId);
  const replies = await fetchRepliesByParentIds(parentIds);

  const allIds = [...parentIds, ...replies.map((reply) => reply._id as Types.ObjectId)];
  const likesCountMap = await getLikesCountByCommentIds(allIds);

  const comments = parentComments.map((parent) => ({
    ...formatComment(parent, likesCountMap),
    replies: replies
      .filter((reply) => reply.parentId?.toString() === String(parent._id))
      .map((reply) => formatComment(reply, likesCountMap)),
  }));

  return { totalCount, comments };
};

export const createCommentUseCase = async (
  data: ICommentBody,
  userId: string,
): Promise<boolean> => {
  if (!ObjectID(data.postId)) {
    throw new AppError('No Post Found', HttpStatus.NOT_FOUND);
  }
  const post = await fetchBlogById(data.postId);
  if (!post) {
    throw new AppError('No Post Found', HttpStatus.NOT_FOUND);
  }

  let parentId: string | null = null;
  if (data.parentId) {
    if (!ObjectID(data.parentId)) {
      throw new AppError('No Parent Comment Found', HttpStatus.NOT_FOUND);
    }
    const parentComment = await fetchCommentById(data.parentId);
    if (!parentComment) {
      throw new AppError('No Parent Comment Found', HttpStatus.NOT_FOUND);
    }
    if (parentComment.postId.toString() !== data.postId) {
      throw new AppError('Parent Comment does not belong to this Post', HttpStatus.BAD_REQUEST);
    }
    if (parentComment.parentId) {
      throw new AppError('Cannot reply to a reply', HttpStatus.BAD_REQUEST);
    }
    parentId = data.parentId;
  }

  const comment = await createComment({
    postId: data.postId,
    userId,
    comment: data.comment,
    parentId,
  });
  if (!comment) {
    throw new AppError('Couldn\'t Create new Comment. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateCommentByIdUseCase = async (
  id: string,
  userId: string,
  data: ICommentUpdateBody,
): Promise<ICommentModel> => {
  if (ObjectID(id)) {
    const comment = await updateCommentById(id, userId, data);
    if (!comment) throw new AppError('No Comment Found', HttpStatus.NOT_FOUND);
    return comment;
  }
  throw new AppError('No Comment Found', HttpStatus.NOT_FOUND);
};

export const deleteCommentByIdUseCase = async (id: string, user: IAuthUser): Promise<boolean> => {
  if (ObjectID(id)) {
    const isAdmin = user.role === 'admin' || user.role === 'administrator';
    const comment = await deleteCommentById(id, isAdmin ? undefined : user.userId);
    if (comment) {
      // remove replies of a deleted parent comment as well
      if (!comment.parentId) {
        await deleteRepliesByParentId(id);
      }
      return true;
    }
  }
  throw new AppError('No Comment Found', HttpStatus.NOT_FOUND);
};

export const likeCommentUseCase = async (commentId: string, userId: string): Promise<boolean> => {
  if (!ObjectID(commentId)) {
    throw new AppError('No Comment Found', HttpStatus.NOT_FOUND);
  }
  const comment = await fetchCommentById(commentId);
  if (!comment) {
    throw new AppError('No Comment Found', HttpStatus.NOT_FOUND);
  }
  await addCommentLike(commentId, userId);
  return true;
};

export const unlikeCommentUseCase = async (commentId: string, userId: string): Promise<boolean> => {
  if (!ObjectID(commentId)) {
    throw new AppError('No Comment Found', HttpStatus.NOT_FOUND);
  }
  await removeCommentLike(commentId, userId);
  return true;
};
