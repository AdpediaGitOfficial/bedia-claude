import { JSONSchemaType } from 'ajv';
import { IGetAllQuery } from '../../types/testimonialTypes';

export const getAllTestimonialsSchema: JSONSchemaType<IGetAllQuery> = {
  type: 'object',
  properties: {
    page: { type: 'string', nullable: true },
    limit: { type: 'string', nullable: true },
    search: { type: 'string', nullable: true },
  },
  required: [],
  additionalProperties: false,
};
