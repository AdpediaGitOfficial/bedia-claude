import { JSONSchemaType } from 'ajv';
import { ICareerFooterBody } from '../../types/careerFooterTypes';

export const createCareerFooterSchema: JSONSchemaType<ICareerFooterBody> = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    content: { type: 'string', minLength: 1 },
    image: { type: 'string', minLength: 1 },
  },
  required: ['title', 'content', 'image'],
  additionalProperties: false,
};
