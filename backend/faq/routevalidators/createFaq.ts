import { JSONSchemaType } from 'ajv';
import { IFaqBody } from '../../types/faqTypes';

export const faqBodySchema: JSONSchemaType<IFaqBody> = {
  type: 'object',

  properties: {
    question: {
      type: 'string',
      minLength: 1,
    },

    answer: {
      type: 'string',
      minLength: 1,
    },

    category: {
      type: 'string',
      nullable: true,
    },

    isActive: {
      type: 'boolean',
      nullable: true,
    },
  },

  required: ['question', 'answer'],

  additionalProperties: false,
};
