import { JSONSchemaType } from 'ajv';
import { IUpdatePasswordBody } from '../../types/authTypes';

export const changePasswordSchema: JSONSchemaType<IUpdatePasswordBody> = {
  type: 'object',
  properties: {
    email: { type: 'string', minLength: 1 },
    oldPassword: { type: 'string', minLength: 1 },
    newPassword: { type: 'string', minLength: 1 },
  },
  required: ['email', 'oldPassword', 'newPassword'],
  additionalProperties: false,
};
