import { JSONSchemaType } from 'ajv';
import { IGetAllQuery } from '../../types/careerTypes';

export const getAllCareerSchema: JSONSchemaType<IGetAllQuery> = {
  type: 'object',
  properties: {
    page: { type: 'string', nullable: true },
    limit: { type: 'string', nullable: true },
    search: { type: 'string', nullable: true },
    type: { type: 'string', nullable: true },
    jobSlug: { type: 'string', nullable: true },
  },
  required: [],
  additionalProperties: false,
};
