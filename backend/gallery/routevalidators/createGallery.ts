import { JSONSchemaType } from 'ajv';
import { IGalleryBody } from '../../types/galleryTypes';

export const createGallerySchema: JSONSchemaType<IGalleryBody> = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      minLength: 1,
    },

    images: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
      },
      minItems: 1,
    },

    description: {
      type: 'string',
      nullable: true,
    },
    isActive: {
      type: 'boolean',
    },
  },
  required: ['title', 'images'],
  additionalProperties: false,
};
