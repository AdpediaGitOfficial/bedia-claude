import { JSONSchemaType } from 'ajv';
import { ITestimonialBody } from '../../types/testimonialTypes';

export const createTestimonialSchema: JSONSchemaType<ITestimonialBody> = {
  type: 'object',
  properties: {
    content: { type: 'string', minLength: 1 },
    author: { type: 'string', minLength: 1 },
    designation: { type: 'string', minLength: 1, nullable: true },
    authorImage: { type: 'string', minLength: 1, nullable: true },
  },
  required: ['content', 'author'],
  // required: ['content', 'author', 'designation', 'authorImage'],
  additionalProperties: false,
};
