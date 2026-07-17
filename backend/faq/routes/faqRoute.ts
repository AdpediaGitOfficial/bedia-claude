import { Router } from 'express';
import {
  createFaq,
  deleteFaqById,
  updateFaqById,
  getAllFaqs,
  getFaqById,
  getAllFaqsForAdmin,
} from '../controllers/faqController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAdminAllFaqsSchema } from '../routevalidators/getAdminAll';
import { getAllFaqsSchema } from '../routevalidators/getAllFaqs';
import { JSONSchemaType } from 'ajv';
import { faqBodySchema } from '../routevalidators/createFaq';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllFaqsSchema as JSONSchemaType<unknown>), getAllFaqs);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAdminAllFaqsSchema as JSONSchemaType<unknown>),
  getAllFaqsForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(faqBodySchema as JSONSchemaType<unknown>),
  createFaq,
);
router.put(
  '/:id',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(faqBodySchema as JSONSchemaType<unknown>),
  updateFaqById,
);
router.delete('/:id', userAuthMiddleware, deleteFaqById);
router.get('/:id', userAuthMiddleware, getFaqById);

export default router;
