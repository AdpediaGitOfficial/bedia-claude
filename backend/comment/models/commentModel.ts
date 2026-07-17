import { Schema, model } from 'mongoose';
import { ICommentModel } from '../../types/commentTypes';

const commentSchema = new Schema<ICommentModel>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'blog', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'comment', default: null, index: true },
    comment: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const commentModel = model<ICommentModel>('comment', commentSchema);
export default commentModel;
