import { Router } from 'express';
import {
  createOpeningHours,
  deleteOpeningHoursById,
  updateOpeningHoursById,
  getAllOpeningHours,
  getOpeningHoursById,
  getAllOpeningHoursForAdmin,
} from '../controllers/openingHoursController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllOpeningHoursSchema } from '../routevalidators/getAllopeningHours';
import { JSONSchemaType } from 'ajv';
import { createOpeningHoursSchema } from '../routevalidators/createOpeningHours';
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';

const router = Router();

router.get(
  '/all',
  validateQuery(getAllOpeningHoursSchema as JSONSchemaType<unknown>),
  getAllOpeningHours,
);
router.get(
  '/adminAll',
  requireAdmin,
  validateQuery(getAllOpeningHoursSchema as JSONSchemaType<unknown>),
  getAllOpeningHoursForAdmin,
);
router.post(
  '/',
  requireAdmin,
  validateReqBody(createOpeningHoursSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createOpeningHours,
);
router.put(
  '/:id',
  requireAdmin,
  validateReqBody(createOpeningHoursSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  updateOpeningHoursById,
);
router.delete('/:id', requireAdmin, deleteOpeningHoursById);
router.get('/:id', requireAdmin, getOpeningHoursById);

export default router;
