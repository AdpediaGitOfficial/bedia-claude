import { JSONSchemaType } from 'ajv';
import { IGetAllQuery } from '../../types/communityPropertyTypes';

export const getCommunityProjectsSchema: JSONSchemaType<IGetAllQuery> = {
  type: 'object',
  properties: {
    page: { type: 'string', nullable: true },
    limit: { type: 'string', nullable: true },
    search: { type: 'string', nullable: true },
    sortBy: { type: 'string', nullable: true },
    order: { type: 'string', enum: ['asc', 'desc'], nullable: true },
  },
  required: [],
  additionalProperties: false,
};
