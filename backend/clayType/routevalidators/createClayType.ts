import { JSONSchemaType } from 'ajv';
import { IClayTypeBody } from '../../types/clayTypeTypes';

export const createClayTypeSchema: JSONSchemaType<IClayTypeBody> = {
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
