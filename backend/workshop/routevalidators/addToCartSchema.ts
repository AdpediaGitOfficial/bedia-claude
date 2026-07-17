import { JSONSchemaType } from 'ajv';

export interface AddToCartInput {
  userId: string;
  workshopId: string;
  bookingDate?: string;
  slotId?: string;
  optionId: string;
  people: number;
  adult?: number;
  child?: number;
  bookingType?: string;
  makingType?: string;
  giftDetails?: {
    recipientName?: string;
    giftEmail?: string;
    giftPhone?: string;
    giftFor?: string;
    occasion?: string;
    personalMessage?: string;
  };
}

export const addToCartSchema: JSONSchemaType<AddToCartInput> = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      minLength: 24,
      maxLength: 24,
    },
    workshopId: {
      type: 'string',
      minLength: 24,
      maxLength: 24,
    },
    bookingDate: { type: 'string', nullable: true },
    slotId: {
      type: 'string',
      nullable: true,
    },
    optionId: {
      type: 'string',
      minLength: 24,
      maxLength: 24,
    },
    people: {
      type: 'integer',
      minimum: 1,
    },
    adult: {
      type: 'number',
      nullable: true,
    },
    child: {
      type: 'number',
      nullable: true,
    },
    makingType: {
      type: 'string',
      nullable: true,
    },
    bookingType: {
      type: 'string',
      nullable: true,
    },
    giftDetails: {
      type: 'object',
      nullable: true,
      properties: {
        recipientName: { type: 'string', nullable: true },
        giftEmail: { type: 'string', nullable: true },
        giftPhone: { type: 'string', nullable: true },
        giftFor: { type: 'string', nullable: true },
        occasion: { type: 'string', nullable: true },
        personalMessage: { type: 'string', nullable: true },
      },
      required: [],
      additionalProperties: false,
    },
  },
  required: ['userId', 'workshopId', 'optionId', 'people'],
  additionalProperties: false,
};
