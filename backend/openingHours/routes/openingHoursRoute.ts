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
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get(
  '/all',
  validateQuery(getAllOpeningHoursSchema as JSONSchemaType<unknown>),
  getAllOpeningHours,
);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllOpeningHoursSchema as JSONSchemaType<unknown>),
  getAllOpeningHoursForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  validateReqBody(createOpeningHoursSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createOpeningHours,
);
router.put(
  '/:id',
  userAuthMiddleware,
  validateReqBody(createOpeningHoursSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  updateOpeningHoursById,
);
router.delete('/:id', userAuthMiddleware, deleteOpeningHoursById);
router.get('/:id', userAuthMiddleware, getOpeningHoursById);

export default router;
