import { JSONSchemaType } from 'ajv';
import { IWorkshopCapacityBody } from '../../types/workshopTypes';

export const workshopCapacitySchema: JSONSchemaType<IWorkshopCapacityBody> = {
  type: 'object',

  properties: {
    bookingDate: {
      type: 'string',
      minLength: 1,
    },
    startTime: {
      type: 'string',
      minLength: 1,
    },
    endTime: {
      type: 'string',
      minLength: 1,
    },
  },

  required: ['bookingDate', 'startTime', 'endTime'],

  additionalProperties: false,
};
