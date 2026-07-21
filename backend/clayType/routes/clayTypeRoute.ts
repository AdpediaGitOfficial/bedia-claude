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
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllClayTypeSchema as JSONSchemaType<unknown>), getAllClayTypes);
router.get(
  '/adminAll',
  requireAdmin,
  validateQuery(getAllClayTypeSchema as JSONSchemaType<unknown>),
  getAllClayTypesForAdmin,
);
router.post(
  '/',
  requireAdmin,
  validateReqBody(createClayTypeSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createClayType,
);
router.put(
  '/:id',
  requireAdmin,
  validateReqBody(createClayTypeSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  updateClayTypeById,
);
router.delete('/:id', requireAdmin, deleteClayTypeById);
router.get('/:id', requireAdmin, getClayTypeById);

export default router;
