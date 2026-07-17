import { JSONSchemaType } from 'ajv';
import { IGoogleReviewBody } from '../../types/googleReviewTypes';

export const googleReviewBodySchema: JSONSchemaType<IGoogleReviewBody> = {
  type: 'object',
  properties: {
    placeId: { type: 'string', minLength: 1 },
    reviewId: { type: 'string', minLength: 1 },

    authorName: { type: 'string', minLength: 1 },

    rating: {
      type: 'number',
      minimum: 1,
      maximum: 5,
    },

    text: { type: 'string', nullable: true },

    profilePhotoUrl: { type: 'string', nullable: true },

    reviewTime: {
      type: 'number',
    },

    media: {
      type: 'object',
      nullable: true,
      properties: {
        videos: {
          type: 'array',
          nullable: true,
          items: { type: 'string' },
        },
        images: {
          type: 'array',
          nullable: true,
          items: { type: 'string' },
        },
      },
      required: [],
      additionalProperties: false,
    },

    source: {
      type: 'string',
      nullable: true,
      enum: ['google', 'manual'],
    },

    isActive: {
      type: 'boolean',
      nullable: true,
    },
  },
  required: ['placeId', 'authorName', 'rating', 'reviewTime'],
  additionalProperties: false,
};
