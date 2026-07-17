import { JSONSchemaType } from 'ajv';
import { IPageMetaBody } from '../../types/pageMetaTypes';

export const createPageMetaSchema: JSONSchemaType<IPageMetaBody> = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    image: { type: 'string', minLength: 1 },
    url: { type: 'string', minLength: 1 },
    keywords: { type: 'string', minLength: 1 },
  },
  required: ['title', 'description', 'image', 'url', 'keywords'],
  additionalProperties: false,
};
