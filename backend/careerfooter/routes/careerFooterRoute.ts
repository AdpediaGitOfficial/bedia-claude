import { Router } from 'express';
import {
  createCareerFooter,
  deleteCareerFooterById,
  updateCareerFooterById,
  getAllCareerFooters,
  getCareerFooterById,
  getAllCareerFootersForAdmin,
} from '../controllers/careerFooterController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllCareerFootersSchema } from '../routevalidators/getAllCareerFooter';
import { JSONSchemaType } from 'ajv';
import { createCareerFooterSchema } from '../routevalidators/createCareerFooter';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get(
  '/all',
  validateQuery(getAllCareerFootersSchema as JSONSchemaType<unknown>),
  getAllCareerFooters,
);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllCareerFootersSchema as JSONSchemaType<unknown>),
  getAllCareerFootersForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(createCareerFooterSchema as JSONSchemaType<unknown>),
  createCareerFooter,
);
router.put(
  '/:id',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(createCareerFooterSchema as JSONSchemaType<unknown>),
  updateCareerFooterById,
);
router.delete('/:id', userAuthMiddleware, deleteCareerFooterById);
router.get('/:id', userAuthMiddleware, getCareerFooterById);

export default router;
