import { JSONSchemaType } from 'ajv';
import { ICategoryBody } from '../../types/categoryTypes';

export const createCategorySchema: JSONSchemaType<ICategoryBody> = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      minLength: 1,
    },
    image: {
      type: 'array',
      items: { type: 'string' },
      nullable: true,
    },
    description: {
      type: 'string',
      nullable: true,
    },
    shortDescription: {
      type: 'string',
      nullable: true,
    },
    parentId: {
      type: 'string',
      nullable: true,
    },
    showOnHomepage: {
      type: 'boolean',
      nullable: true,
    },
    isActive: { type: 'boolean', nullable: true },
  },

  required: ['title'],
  additionalProperties: false,
};
