import { JSONSchemaType } from 'ajv';
import { ITermsAndConditionBody } from '../../types/termsAndConditionTypes';

export const termsAndConditionBodySchema: JSONSchemaType<ITermsAndConditionBody> = {
  type: 'object',

  properties: {
    title: {
      type: 'string',
      minLength: 1,
    },

    content: {
      type: 'string',
      minLength: 1,
    },

    isActive: {
      type: 'boolean',
      nullable: true,
    },
  },

  required: ['title', 'content'],

  additionalProperties: false,
};
