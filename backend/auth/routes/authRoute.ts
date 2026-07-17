import { Router } from 'express';
import {
  loginUser,
  registerUser,
  verifyToken,
  getAllUsers,
  // updateUserById,
  deleteUserById,
  // getUserById,
  changePassword,
  getDashboardData,
} from '../controllers/authController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { loginUserSchema } from '../routevalidators/login';
import { JSONSchemaType } from 'ajv';
import { registerUserSchema } from '../routevalidators/reigster';
// import { updateUserSchema } from '../routevalidators/updateUser';
import { getAllUsersSchema } from '../routevalidators/getAllUsers';
import { adminAuthMiddleware, userAuthMiddleware } from '../../middleware/auth/authMiddleware';
import { changePasswordSchema } from '../routevalidators/changePassword';
import { loginLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  sanitizeBody,
  validateReqBody(loginUserSchema as JSONSchemaType<unknown>),
  loginUser,
);

router.post(
  '/register',
  // adminAuthMiddleware,
  // sanitizeBody,
  validateReqBody(registerUserSchema as JSONSchemaType<unknown>),
  registerUser,
);

router.post('/verifyToken', verifyToken);

router.get(
  '/user/all',
  adminAuthMiddleware,
  validateQuery(getAllUsersSchema as JSONSchemaType<unknown>),
  getAllUsers,
);
router.put(
  '/change-password',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(changePasswordSchema as JSONSchemaType<unknown>),
  changePassword,
);
router.delete('/user/:id', adminAuthMiddleware, deleteUserById);
router.get('/user/dashboard-data', userAuthMiddleware, getDashboardData);

// router.put(      // MAY BE USE LATER===========================================
//   '/user/:id',
//   sanitizeBody,
//   validateReqBody(updateUserSchema as JSONSchemaType<unknown>),
//   updateUserById,
// );
// router.get('/user/:id', getUserById);

export default router;
