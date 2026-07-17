/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';
import AppError from '../common/appError';
import { HttpStatus } from '../common/httpStatus';

const ajv = new Ajv();

export const validateQuery = (schema: JSONSchemaType<unknown>) => {
  return (req: Request, res: Response, next: Function) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.query);

    if (!valid) {
      let errorMessage = 'Invalid query parameters';
      if (validate.errors && validate.errors.length > 0) {
        errorMessage = validate.errors[0].message || errorMessage;
      }
      throw new AppError(errorMessage, HttpStatus.NOT_ACCEPTABLE);
    }
    next();
  };
};

export const validateBody = (schema: JSONSchemaType<unknown>) => {
  return (req: Request, res: Response, next: Function) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);

    if (!valid) {
      let errorMessage = 'Invalid query parameters';
      if (validate.errors && validate.errors.length > 0) {
        errorMessage = validate.errors[0].message || errorMessage;
      }
      throw new AppError(errorMessage, HttpStatus.NOT_ACCEPTABLE);
    }

    next();
  };
};

export const validateReqBody = (schema: JSONSchemaType<unknown>) => {
  return (req: Request, res: Response, next: Function) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);

    if (!valid) {
      let errorMessage = 'Invalid request body';
      if (validate.errors && validate.errors.length > 0) {
        const error = validate.errors[0];
        const { instancePath, message } = error;
        const fieldName = instancePath.substring(1);
        errorMessage = `${fieldName} ${message}` || errorMessage;
      }
      throw new AppError(errorMessage, HttpStatus.NOT_ACCEPTABLE);
    }

    next();
  };
};
