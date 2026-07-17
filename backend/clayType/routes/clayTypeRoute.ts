import { Router } from 'express';
import {
  createClayType,
  deleteClayTypeById,
  updateClayTypeById,
  getAllClayTypes,
  getClayTypeById,
  getAllClayTypesForAdmin,
} from '../controllers/clayTypeController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllClayTypeSchema } from '../routevalidators/getAllClayType';
import { JSONSchemaType } from 'ajv';
import { createClayTypeSchema } from '../routevalidators/createClayType';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllClayTypeSchema as JSONSchemaType<unknown>), getAllClayTypes);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllClayTypeSchema as JSONSchemaType<unknown>),
  getAllClayTypesForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  validateReqBody(createClayTypeSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createClayType,
);
router.put(
  '/:id',
  userAuthMiddleware,
  validateReqBody(createClayTypeSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  updateClayTypeById,
);
router.delete('/:id', userAuthMiddleware, deleteClayTypeById);
router.get('/:id', userAuthMiddleware, getClayTypeById);

export default router;
