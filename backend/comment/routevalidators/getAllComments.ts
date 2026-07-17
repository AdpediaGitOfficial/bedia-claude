import { JSONSchemaType } from 'ajv';
import { IGetCommentsQuery } from '../../types/commentTypes';

export const getAllCommentsSchema: JSONSchemaType<IGetCommentsQuery> = {
  type: 'object',
  properties: {
    page: { type: 'string', nullable: true },
    limit: { type: 'string', nullable: true },
  },
  required: [],
  additionalProperties: false,
};
