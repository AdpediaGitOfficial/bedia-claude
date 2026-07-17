import { JSONSchemaType } from 'ajv';
import { ICommunityPropertyBody } from '../../types/communityPropertyTypes';

export const communityPropertyBodySchema: JSONSchemaType<ICommunityPropertyBody> = {
  type: 'object',
  properties: {
    image: { type: 'string', minLength: 1 },
    heading: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    price: { type: 'number' },
    bedrooms: { type: 'string', minLength: 1 },
    shortTitle: { type: 'string', minLength: 1 },
    brochure: { type: 'string', nullable: true },
    paymentPlan: { type: 'string', nullable: true },
    highlightTitle: { type: 'string', minLength: 1 },
    highlightDescription: { type: 'string', minLength: 1 },
    bannerImage: { type: 'string', nullable: true },
    slug: { type: 'string', nullable: true },
    floorPlan: { type: 'string', nullable: true },
  },
  required: [
    'image',
    'heading',
    'description',
    'price',
    'bedrooms',
    'shortTitle',
    'highlightTitle',
    'highlightDescription',
  ],
  additionalProperties: false,
};
