import { Router } from 'express';
import {
  createTestimonial,
  deleteTestimonialById,
  updateTestimonialById,
  getAllTestimonials,
  getTestimonialById,
  getAllTestimonialsForAdmin,
} from '../controllers/testimonialController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllTestimonialsSchema } from '../routevalidators/getAllTestimonials';
import { JSONSchemaType } from 'ajv';
import { createTestimonialSchema } from '../routevalidators/createTestimonial';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get(
  '/all',
  validateQuery(getAllTestimonialsSchema as JSONSchemaType<unknown>),
  getAllTestimonials,
);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllTestimonialsSchema as JSONSchemaType<unknown>),
  getAllTestimonialsForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(createTestimonialSchema as JSONSchemaType<unknown>),
  createTestimonial,
);
router.put(
  '/:id',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(createTestimonialSchema as JSONSchemaType<unknown>),
  updateTestimonialById,
);
router.delete('/:id', userAuthMiddleware, deleteTestimonialById);
router.get('/:id', userAuthMiddleware, getTestimonialById);

export default router;
