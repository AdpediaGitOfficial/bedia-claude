import { Document, Types } from 'mongoose';

export interface ICommentModel extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  parentId: Types.ObjectId | null;
  comment: string;
  isDeleted: boolean;
}

export interface ICommentLikeModel extends Document {
  commentId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface ICommentBody {
  postId: string;
  comment: string;
  parentId?: string;
}

export interface ICommentCreateData {
  postId: string;
  userId: string;
  comment: string;
  parentId: string | null;
}

export interface ICommentUpdateBody {
  comment: string;
}

export interface IGetCommentsQuery {
  page?: string;
  limit?: string;
}

export interface IAuthUser {
  userId?: string;
  role?: string;
  email?: string;
}
