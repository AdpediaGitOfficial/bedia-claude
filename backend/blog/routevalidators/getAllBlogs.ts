import { JSONSchemaType } from 'ajv';
import { IGetAllQuery } from '../../types/blogTypes';

export const getAllBlogsSchema: JSONSchemaType<IGetAllQuery> = {
  type: 'object',
  properties: {
    page: { type: 'string', nullable: true },
    limit: { type: 'string', nullable: true },
    search: { type: 'string', nullable: true },
  },
  required: [],
  additionalProperties: false,
};
