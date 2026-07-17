import { JSONSchemaType } from 'ajv';
import { ICreateWorkshopBookingBody } from '../../types/workshopTypes';

const objectIdPattern = '^[a-fA-F0-9]{24}$';

export const createWorkshopBookingSchema: JSONSchemaType<ICreateWorkshopBookingBody> = {
  type: 'object',

  properties: {
    workshops: {
      type: 'array',
      minItems: 1,

      items: {
        type: 'object',

        properties: {
          workshopId: {
            type: 'string',
            pattern: objectIdPattern,
          },
          makingType: {
            type: 'string',
            nullable: true,
          },

          bookingDate: {
            type: 'string',
            nullable: true,
          },

          slotId: {
            type: 'string',
            pattern: objectIdPattern,
            nullable: true,
          },

          items: {
            type: 'array',
            minItems: 1,

            items: {
              type: 'object',

              properties: {
                optionId: {
                  type: 'string',
                  pattern: objectIdPattern,
                },

                people: {
                  type: 'number',
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
              },

              required: ['optionId', 'people'],
              additionalProperties: false,
            },
          },
        },

        required: ['workshopId', 'items'],
        additionalProperties: false,
      },
    },

    bookingType: {
      type: 'string',
      enum: ['normal', 'gift', 'pottery'],
      nullable: true,
    },

    giftDetails: {
      type: 'object',
      nullable: true,

      properties: {
        recipientName: {
          type: 'string',
          nullable: true,
        },

        giftEmail: {
          type: 'string',
          nullable: true,
        },

        giftPhone: {
          type: 'string',
          nullable: true,
        },

        giftFor: {
          type: 'string',
          nullable: true,
        },

        occasion: {
          type: 'string',
          nullable: true,
        },

        personalMessage: {
          type: 'string',
          nullable: true,
        },
      },

      required: [],
      additionalProperties: false,
    },

    customer: {
      type: 'object',

      properties: {
        firstName: {
          type: 'string',
          minLength: 1,
        },

        lastName: {
          type: 'string',
          minLength: 1,
        },

        companyName: {
          type: 'string',
          nullable: true,
        },

        notes: {
          type: 'string',
          nullable: true,
        },

        country: {
          type: 'string',
          nullable: true,
        },

        address: {
          type: 'string',
          nullable: true,
        },

        city: {
          type: 'string',
          nullable: true,
        },

        state: {
          type: 'string',
          nullable: true,
        },

        zipCode: {
          type: 'string',
          nullable: true,
        },

        phone: {
          type: 'string',
          minLength: 5,
        },

        email: {
          type: 'string',
          minLength: 1,
        },
      },

      required: ['firstName', 'lastName', 'phone', 'email'],
      additionalProperties: false,
    },
  },

  required: ['workshops', 'customer'],
  additionalProperties: false,
};
