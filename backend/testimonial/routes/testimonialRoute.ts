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
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';

const router = Router();

router.get(
  '/all',
  validateQuery(getAllTestimonialsSchema as JSONSchemaType<unknown>),
  getAllTestimonials,
);
router.get(
  '/adminAll',
  requireAdmin,
  validateQuery(getAllTestimonialsSchema as JSONSchemaType<unknown>),
  getAllTestimonialsForAdmin,
);
router.post(
  '/',
  requireAdmin,
  sanitizeBody,
  validateReqBody(createTestimonialSchema as JSONSchemaType<unknown>),
  createTestimonial,
);
router.put(
  '/:id',
  requireAdmin,
  sanitizeBody,
  validateReqBody(createTestimonialSchema as JSONSchemaType<unknown>),
  updateTestimonialById,
);
router.delete('/:id', requireAdmin, deleteTestimonialById);
router.get('/:id', requireAdmin, getTestimonialById);

export default router;
