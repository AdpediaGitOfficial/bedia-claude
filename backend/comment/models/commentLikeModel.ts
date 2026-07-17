import { Schema, model } from 'mongoose';
import { ICommentLikeModel } from '../../types/commentTypes';

const commentLikeSchema = new Schema<ICommentLikeModel>(
  {
    commentId: { type: Schema.Types.ObjectId, ref: 'comment', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  },
  { timestamps: true },
);

// One like per user per comment
commentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

const commentLikeModel = model<ICommentLikeModel>('commentLike', commentLikeSchema);
export default commentLikeModel;
