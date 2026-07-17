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
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get(
  '/all',
  validateQuery(getAllGoogleReviewsSchema as JSONSchemaType<unknown>),
  getAllGoogleReviews,
);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAdminAllGoogleReviewsSchema as JSONSchemaType<unknown>),
  getAllGoogleReviewsForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(googleReviewBodySchema as JSONSchemaType<unknown>),
  createGoogleReview,
);

router.post('/sync', userAuthMiddleware, syncGoogleReviews);

router.put('/:id', userAuthMiddleware, sanitizeBody, updateGoogleReviewById);
router.delete('/:id', userAuthMiddleware, deleteGoogleReviewById);
router.get('/:id', userAuthMiddleware, getGoogleReviewById);

export default router;
