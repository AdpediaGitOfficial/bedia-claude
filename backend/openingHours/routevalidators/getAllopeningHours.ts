import { JSONSchemaType } from 'ajv';
import { IGetAllQuery } from '../../types/openingHoursTypes';

export const getAllOpeningHoursSchema: JSONSchemaType<IGetAllQuery> = {
  type: 'object',
  properties: {
    page: {
      type: 'string',
      nullable: true,
    },
    limit: {
      type: 'string',
      nullable: true,
    },
    search: {
      type: 'string',
      nullable: true,
    },
  },
  additionalProperties: false,
};
