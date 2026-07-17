import { Types } from 'mongoose';
import { ObjectID } from '../../utils/objectIdParser';
import commentLikeModel from '../models/commentLikeModel';

export const addCommentLike = async (commentId: string, userId: string): Promise<boolean> => {
  await commentLikeModel.updateOne(
    { commentId: ObjectID(commentId), userId: ObjectID(userId) },
    { $setOnInsert: { commentId: ObjectID(commentId), userId: ObjectID(userId) } },
    { upsert: true },
  );
  return true;
};

export const removeCommentLike = async (commentId: string, userId: string): Promise<boolean> => {
  await commentLikeModel.deleteOne({
    commentId: ObjectID(commentId),
    userId: ObjectID(userId),
  });
  return true;
};

export const getCommentLikesCount = async (commentId: string): Promise<number> => {
  return await commentLikeModel.countDocuments({ commentId: ObjectID(commentId) });
};

export const getLikesCountByCommentIds = async (
  commentIds: Types.ObjectId[],
): Promise<Record<string, number>> => {
  const counts = await commentLikeModel.aggregate([
    { $match: { commentId: { $in: commentIds } } },
    { $group: { _id: '$commentId', count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  counts.forEach((item: { _id: Types.ObjectId; count: number }) => {
    countMap[item._id.toString()] = item.count;
  });
  return countMap;
};

export const removeLikesByCommentIds = async (commentIds: Types.ObjectId[]): Promise<boolean> => {
  await commentLikeModel.deleteMany({ commentId: { $in: commentIds } });
  return true;
};
