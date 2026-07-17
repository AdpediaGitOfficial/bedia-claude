import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const userRegisterValidation = [
  body('fullName')
    .notEmpty()
    .withMessage('fullName is required')
    .isString()
    .withMessage('fullName must be a string'),
  body('userType')
    .notEmpty()
    .withMessage('userType is required')
    .isIn(['admin', 'user'])
    .withMessage('Invalid userType'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isString()
    .withMessage('password must be a string')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
];

export const verifyOtpValidation = [
  body('mobileNumber')
    .notEmpty()
    .withMessage('mobileNumber is required')
    .isNumeric()
    .withMessage('mobileNumber must be a number'),
  body('otp')
    .notEmpty()
    .withMessage('otp is required')
    .isString()
    .withMessage('otp must be a string'),
  body('deviceId')
    .notEmpty()
    .withMessage('deviceId is required')
    .isString()
    .withMessage('deviceId must be a string'),
  body('deviceType')
    .notEmpty()
    .withMessage('deviceType is required')
    .isString()
    .withMessage('deviceType must be a string'),
];

export const sendOtpValidation = [
  body('mobileNumber')
    .notEmpty()
    .withMessage('mobileNumber is required')
    .isNumeric()
    .withMessage('mobileNumber must be a number'),
];

export const getProfileValidation = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userId format');
      }
      return true;
    }),
];

export const courseMaterialTrackValidation = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userId format');
      }
      return true;
    }),
];

export const userUpdateValidation = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userId format');
      }
      return true;
    }),

  body('fullName').optional().isString().withMessage('fullName must be a string'),

  body('mobileNumber').optional().isNumeric().withMessage('mobileNumber must be a number'),

  body('dob').optional().isDate().withMessage('Invalid date format'),

  body('email').optional().isEmail().withMessage('Invalid email format'),

  body('parentName').optional().isString().withMessage('parentName must be a string'),

  body('parentDob').optional().isDate().withMessage('Invalid date format for parentDob'),

  body('interest').optional().isString().withMessage('interest must be a string'),

  body('gender').optional().isString().withMessage('gender must be a string'),
];

export const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid Email ID'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
];

export const adminRegisterValidation = [
  body('fullName')
    .notEmpty()
    .withMessage('fullName is required')
    .isString()
    .withMessage('fullName must be a string'),
  body('mobileNumber')
    .notEmpty()
    .withMessage('mobileNumber is required')
    .isNumeric()
    .withMessage('mobileNumber must be a number'),
  body('dob')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isDate()
    .withMessage('Invalid date format'),
  body('userType')
    .notEmpty()
    .withMessage('userType is required')
    .isIn(['child', 'teenager', 'adult'])
    .withMessage('Invalid userType'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&]/)
    .withMessage('Password must contain at least one special character'),
];

export const userDobValidation = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userId format');
      }
      return true;
    }),
  body('parentDob')
    .notEmpty()
    .withMessage('parentDob is required')
    .isDate()
    .withMessage('Invalid date format for parentDob'),
  body('parentName')
    .notEmpty()
    .withMessage('parentName is required')
    .isString()
    .withMessage('parentName must be a string'),
];

export const userDobVerifyValidation = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userId format');
      }
      return true;
    }),
  body('parentDobYear')
    .notEmpty()
    .withMessage('parentDobYear is required')
    .isNumeric()
    .withMessage('parentDobYear must be a number'),
];

export const switchStudentValidation = [
  param('studentId')
    .notEmpty()
    .withMessage('studentId is required')
    .isMongoId()
    .withMessage('Invalid studentId format'),
];

export const logoutValidation = [
  body('deviceType')
    .notEmpty()
    .withMessage('deviceType is required')
    .isString()
    .withMessage('deviceType must be a string'),
];
