import { JSONSchemaType } from 'ajv';
import { IBlogBody } from '../../types/blogTypes';

export const blogBodySchema: JSONSchemaType<IBlogBody> = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    content: { type: 'string', minLength: 1 },
    category: { type: 'string', nullable: true },
    bannerImage: { type: 'string', minLength: 1 },
    metaTitle: { type: 'string', nullable: true },
    metaDescription: { type: 'string', nullable: true },
    writtenBy: { type: 'string', minLength: 1 },
    createdAt: { type: 'string', nullable: true },
    updatedAt: { type: 'string', nullable: true },
    slug: { type: 'string', nullable: true },
  },
  required: ['title', 'content', 'bannerImage', 'writtenBy'],
  additionalProperties: false,
};
