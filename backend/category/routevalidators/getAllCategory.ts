import { JSONSchemaType } from 'ajv';
import { IGetAllQuery } from '../../types/categoryTypes';

export const getAllCategorySchema: JSONSchemaType<IGetAllQuery> = {
  type: 'object',
  properties: {
    page: {
      type: 'string',
      nullable: true,
    },
    limit: {
      type: 'string',
      nullable: true,
    },
    search: {
      type: 'string',
      nullable: true,
    },
    parentId: {
      type: 'string',
      nullable: true,
    },
  },
  additionalProperties: false,
};
