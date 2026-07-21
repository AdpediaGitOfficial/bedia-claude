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
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllFaqsSchema as JSONSchemaType<unknown>), getAllFaqs);
router.get(
  '/adminAll',
  requireAdmin,
  validateQuery(getAdminAllFaqsSchema as JSONSchemaType<unknown>),
  getAllFaqsForAdmin,
);
router.post(
  '/',
  requireAdmin,
  sanitizeBody,
  validateReqBody(faqBodySchema as JSONSchemaType<unknown>),
  createFaq,
);
router.put(
  '/:id',
  requireAdmin,
  sanitizeBody,
  validateReqBody(faqBodySchema as JSONSchemaType<unknown>),
  updateFaqById,
);
router.delete('/:id', requireAdmin, deleteFaqById);
router.get('/:id', requireAdmin, getFaqById);

export default router;
