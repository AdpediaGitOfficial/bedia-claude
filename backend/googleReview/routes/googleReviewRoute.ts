import { Router } from 'express';
import {
  createGoogleReview,
  deleteGoogleReviewById,
  updateGoogleReviewById,
  getAllGoogleReviews,
  getGoogleReviewById,
  getAllGoogleReviewsForAdmin,
  syncGoogleReviews,
} from '../controllers/googleReviewController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAdminAllGoogleReviewsSchema } from '../routevalidators/getAdminAll';
import { getAllGoogleReviewsSchema } from '../routevalidators/getAllGoogleReview';
import { JSONSchemaType } from 'ajv';
import { googleReviewBodySchema } from '../routevalidators/createGoogleReview';
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';

const router = Router();

router.get(
  '/all',
  validateQuery(getAllGoogleReviewsSchema as JSONSchemaType<unknown>),
  getAllGoogleReviews,
);
router.get(
  '/adminAll',
  requireAdmin,
  validateQuery(getAdminAllGoogleReviewsSchema as JSONSchemaType<unknown>),
  getAllGoogleReviewsForAdmin,
);
router.post(
  '/',
  requireAdmin,
  sanitizeBody,
  validateReqBody(googleReviewBodySchema as JSONSchemaType<unknown>),
  createGoogleReview,
);

router.post('/sync', requireAdmin, syncGoogleReviews);

router.put('/:id', requireAdmin, sanitizeBody, updateGoogleReviewById);
router.delete('/:id', requireAdmin, deleteGoogleReviewById);
router.get('/:id', requireAdmin, getGoogleReviewById);

export default router;
