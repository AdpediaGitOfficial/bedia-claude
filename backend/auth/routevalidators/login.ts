import { JSONSchemaType } from 'ajv';
import { IUserLoginBody } from '../../types/authTypes';

export const loginUserSchema: JSONSchemaType<IUserLoginBody> = {
  type: 'object',
  properties: {
    email: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 1 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};
