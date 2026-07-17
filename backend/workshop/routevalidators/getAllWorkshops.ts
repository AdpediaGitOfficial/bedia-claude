import { JSONSchemaType } from 'ajv';
import { IGetAllQuery } from '../../types/workshopTypes';

export const getAllWorkshopSchema: JSONSchemaType<IGetAllQuery> = {
  type: 'object',

  properties: {
    page: { type: 'string', nullable: true },
    limit: { type: 'string', nullable: true },
    search: { type: 'string', nullable: true },
    categoryId: { type: 'string', nullable: true },
    isActive: { type: 'string', nullable: true },
    slug: { type: 'string', nullable: true },
  },

  required: [],

  additionalProperties: false,
};
