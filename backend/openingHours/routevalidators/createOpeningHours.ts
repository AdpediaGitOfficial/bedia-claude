import { JSONSchemaType } from 'ajv';
import { IOpeningHoursBody } from '../../types/openingHoursTypes';

export const createOpeningHoursSchema: JSONSchemaType<IOpeningHoursBody> = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    days: {
      type: 'string',
      minLength: 1,
    },
    openTime: {
      type: 'string',
      minLength: 1,
    },
    closeTime: {
      type: 'string',
      minLength: 1,
    },
    isActive: {
      type: 'boolean',
    },
  },
  required: ['days', 'openTime', 'closeTime'],
  additionalProperties: false,
};
