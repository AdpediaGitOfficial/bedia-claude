import { JSONSchemaType } from 'ajv';
import { IUserRegisterBody } from '../../types/authTypes';

export const registerUserSchema: JSONSchemaType<IUserRegisterBody> = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 1 },
    designation: { type: 'string', minLength: 1, nullable: true },
    password: { type: 'string', minLength: 1 },
  },
  required: ['name', 'email', 'password'],
  additionalProperties: false,
};
