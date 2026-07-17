import { Router } from 'express';
import {
  createBrochure,
  deleteBrochureById,
  updateBrochureById,
  getAllBrochures,
  getBrochureById,
  getAllBrochuresForAdmin,
} from '../controllers/brochureController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllBrochureSchema } from '../routevalidators/getAllBrochure';
import { JSONSchemaType } from 'ajv';
import { createBrochureSchema } from '../routevalidators/createBrochure';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllBrochureSchema as JSONSchemaType<unknown>), getAllBrochures);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllBrochureSchema as JSONSchemaType<unknown>),
  getAllBrochuresForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  validateReqBody(createBrochureSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createBrochure,
);
router.put(
  '/:id',
  userAuthMiddleware,
  validateReqBody(createBrochureSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  updateBrochureById,
);
router.delete('/:id', userAuthMiddleware, deleteBrochureById);
router.get('/:id', userAuthMiddleware, getBrochureById);

export default router;
