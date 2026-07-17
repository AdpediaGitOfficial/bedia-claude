import { JSONSchemaType } from 'ajv';
import { IPartnerBody } from '../../types/partnerTypes';

export const createPartnerSchema: JSONSchemaType<IPartnerBody> = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    logo: { type: 'string', minLength: 1 },
    websiteUrl: { type: 'string', minLength: 1 },
  },
  required: ['name', 'logo', 'websiteUrl'],
  additionalProperties: false,
};
