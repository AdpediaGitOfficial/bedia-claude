import { JSONSchemaType } from 'ajv';
import { ICommentBody } from '../../types/commentTypes';

export const commentBodySchema: JSONSchemaType<ICommentBody> = {
  type: 'object',
  properties: {
    postId: { type: 'string', minLength: 1 },
    comment: { type: 'string', minLength: 1 },
    parentId: { type: 'string', nullable: true },
  },
  required: ['postId', 'comment'],
  additionalProperties: false,
};
