import { JSONSchemaType } from 'ajv';
import { ICommentUpdateBody } from '../../types/commentTypes';

export const commentUpdateBodySchema: JSONSchemaType<ICommentUpdateBody> = {
  type: 'object',
  properties: {
    comment: { type: 'string', minLength: 1 },
  },
  required: ['comment'],
  additionalProperties: false,
};
