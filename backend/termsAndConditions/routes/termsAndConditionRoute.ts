import { Router } from 'express';
import {
  createTermsAndCondition,
  deleteTermsAndConditionById,
  updateTermsAndConditionById,
  getAllTermsAndConditions,
  getTermsAndConditionById,
  getTermsAndConditionBySlug,
  fetchFromXml,
  getAllTermsAndConditionsForAdmin,
  getTermsAndConditionMetaBySlug,
} from '../controllers/termsAndConditionController';
import multerConfig from '../../middleware/multer';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAdminAllTermsAndConditionsSchema } from '../routevalidators/getAdminAll';
import { getAllTermsAndConditionsSchema } from '../routevalidators/getAllTermsAndCondition';
import { JSONSchemaType } from 'ajv';
import { termsAndConditionBodySchema } from '../routevalidators/createTermsAndCondition';
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';

const router = Router();

router.get(
  '/all',
  validateQuery(getAllTermsAndConditionsSchema as JSONSchemaType<unknown>),
  getAllTermsAndConditions,
);
router.get('/slug/:slug', getTermsAndConditionBySlug);
router.get('/meta/:slug', getTermsAndConditionMetaBySlug);
router.get(
  '/adminAll',
  requireAdmin,
  validateQuery(getAdminAllTermsAndConditionsSchema as JSONSchemaType<unknown>),
  getAllTermsAndConditionsForAdmin,
);
router.post(
  '/',
  requireAdmin,
  sanitizeBody,
  validateReqBody(termsAndConditionBodySchema as JSONSchemaType<unknown>),
  createTermsAndCondition,
);
router.post('/xml', multerConfig.multipleFileUpload(), fetchFromXml);
router.put(
  '/:id',
  requireAdmin,
  sanitizeBody,
  validateReqBody(termsAndConditionBodySchema as JSONSchemaType<unknown>),
  updateTermsAndConditionById,
);
router.delete('/:id', requireAdmin, deleteTermsAndConditionById);
router.get('/:id', requireAdmin, getTermsAndConditionById);

export default router;
