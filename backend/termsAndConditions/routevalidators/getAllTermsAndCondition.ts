import { JSONSchemaType } from 'ajv';
import { IGetAllQuery } from '../../types/termsAndConditionTypes';

export const getAllTermsAndConditionsSchema: JSONSchemaType<IGetAllQuery> = {
  type: 'object',
  properties: {
    page: { type: 'string', nullable: true },
    limit: { type: 'string', nullable: true },
    search: { type: 'string', nullable: true },
    isActive: { type: 'string', nullable: true },
  },
  required: [],
  additionalProperties: false,
};
