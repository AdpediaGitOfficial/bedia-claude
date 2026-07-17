import { JSONSchemaType } from 'ajv';
import { IUpdateUserBody } from '../../types/authTypes';

export const updateUserSchema: JSONSchemaType<IUpdateUserBody> = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 1 },
    designation: { type: 'string', minLength: 1, nullable: true },
    newPassword: { type: 'string', nullable: true },
    oldPassword: { type: 'string', nullable: true },
  },
  required: ['name', 'email'],
  additionalProperties: false,
};
