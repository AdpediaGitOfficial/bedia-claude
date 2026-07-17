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
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

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
  userAuthMiddleware,
  validateQuery(getAdminAllTermsAndConditionsSchema as JSONSchemaType<unknown>),
  getAllTermsAndConditionsForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(termsAndConditionBodySchema as JSONSchemaType<unknown>),
  createTermsAndCondition,
);
router.post('/xml', multerConfig.multipleFileUpload(), fetchFromXml);
router.put(
  '/:id',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(termsAndConditionBodySchema as JSONSchemaType<unknown>),
  updateTermsAndConditionById,
);
router.delete('/:id', userAuthMiddleware, deleteTermsAndConditionById);
router.get('/:id', userAuthMiddleware, getTermsAndConditionById);

export default router;
