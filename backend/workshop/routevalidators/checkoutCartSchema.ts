import { JSONSchemaType } from 'ajv';
import { ICheckoutCartBody } from '../../types/workshopTypes';

const objectIdPattern = '^[a-fA-F0-9]{24}$';

export const checkoutCartSchema: JSONSchemaType<ICheckoutCartBody> = {
  type: 'object',

  properties: {
    userId: { type: 'string', pattern: objectIdPattern },

    customer: {
      type: 'object',
      properties: {
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        companyName: { type: 'string', nullable: true },
        notes: { type: 'string', nullable: true },
        country: { type: 'string', nullable: true },
        address: { type: 'string', nullable: true },
        city: { type: 'string', nullable: true },
        state: { type: 'string', nullable: true },
        zipCode: { type: 'string', nullable: true },
        phone: { type: 'string', minLength: 5 },
        email: { type: 'string', format: 'email' },
      },
      required: ['firstName', 'lastName', 'phone', 'email'],
      additionalProperties: false,
    },
  },

  required: ['userId', 'customer'],
  additionalProperties: false,
};
