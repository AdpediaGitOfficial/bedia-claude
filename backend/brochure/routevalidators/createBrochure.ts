import { JSONSchemaType } from 'ajv';
import { IBrochureBody } from '../../types/brochureTypes';

export const createBrochureSchema: JSONSchemaType<IBrochureBody> = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    fileUrl: { type: 'string', nullable: true },
    description: { type: 'string', nullable: true },
  },
  required: ['title'],
  additionalProperties: true,
};
