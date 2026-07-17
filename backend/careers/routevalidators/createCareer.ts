import { JSONSchemaType } from 'ajv';
import { ICareerBody } from '../../types/careerTypes';

export const createCareerSchema: JSONSchemaType<ICareerBody> = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    responsibilities: { type: 'string', nullable: true },
    requirements: { type: 'string', nullable: true },
    roleSummary: { type: 'string', nullable: true },
    jobType: { type: 'string', minLength: 1, enum: ['Hybrid', 'Remote', 'In Person'] },
    workingHours: { type: 'string', minLength: 1, enum: ['Full Time', 'Part Time'] },
    isActive: { type: 'boolean' },
  },
  required: [
    'title',
    'description',
    //'responsibilities',
    //'requirements',
    //'roleSummary',
    'jobType',
    'workingHours',
  ],
  additionalProperties: true,
};
