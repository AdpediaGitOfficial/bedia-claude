import { JSONSchemaType } from 'ajv';
import { ILeadsBody } from '../../types/leadsTypes';

export const createLeadSchema: JSONSchemaType<ILeadsBody> = {
  type: 'object',
  properties: {
    userName: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 1 },
    phone: { type: 'string', minLength: 1 },
    preferredLanguage: { type: 'string', nullable: true },
    propertyType: { type: 'string', minLength: 1 },
    propertySlug: { type: 'string', minLength: 1 },
    leadType: { type: 'string', minLength: 1 },
    message: { type: 'string', nullable: true },
    preferredDate: { type: 'string', nullable: true },
    propertyIdentifier: { type: 'string', nullable: true },
  },
  required: ['userName', 'email', 'phone', 'propertyType', 'propertySlug', 'leadType'],
  additionalProperties: true,
};
