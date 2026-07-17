import { Types } from 'mongoose';
import { ICommentModel, ICommentCreateData, ICommentUpdateBody } from '../../types/commentTypes';
import { ObjectID } from '../../utils/objectIdParser';
import commentModel from '../models/commentModel';

export const getCommentsCount = async (query: object): Promise<number> => {
  return await commentModel.countDocuments(query);
};

export const fetchParentCommentsByPostId = async (
  postId: string,
  skip: number,
  limit: number,
): Promise<ICommentModel[]> => {
  const dbQuery = {
    postId: ObjectID(postId),
    parentId: null,
    isDeleted: false,
  };
  return await commentModel
    .find(dbQuery)
    .select({ isDeleted: 0, __v: 0 })
    .populate('userId', 'fullName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchRepliesByParentIds = async (
  parentIds: Types.ObjectId[],
): Promise<ICommentModel[]> => {
  const dbQuery = {
    parentId: { $in: parentIds },
    isDeleted: false,
  };
  return await commentModel
    .find(dbQuery)
    .select({ isDeleted: 0, __v: 0 })
    .populate('userId', 'fullName avatar')
    .sort({ createdAt: 1 })
    .lean();
};

export const fetchCommentById = async (id: string): Promise<ICommentModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await commentModel.findOne(dbQuery).select({ isDeleted: 0, __v: 0 }).lean();
};

export const createComment = async (data: ICommentCreateData): Promise<ICommentModel | null> => {
  return await commentModel.create(data);
};

export const updateCommentById = async (
  id: string,
  userId: string,
  data: ICommentUpdateBody,
): Promise<ICommentModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    userId: ObjectID(userId),
    isDeleted: false,
  };
  return await commentModel.findOneAndUpdate(dbQuery, data, { new: true });
};

export const deleteCommentById = async (
  id: string,
  userId?: string,
): Promise<ICommentModel | null> => {
  const dbQuery: any = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  if (userId) dbQuery.userId = ObjectID(userId);
  return await commentModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};

export const deleteRepliesByParentId = async (parentId: string): Promise<boolean> => {
  await commentModel.updateMany(
    { parentId: ObjectID(parentId), isDeleted: false },
    { isDeleted: true },
  );
  return true;
};
