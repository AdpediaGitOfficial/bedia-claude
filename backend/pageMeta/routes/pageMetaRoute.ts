import { Router } from 'express';
import {
  createPageMeta,
  deletePageMetaById,
  updatePageMetaById,
  getPageMetaById,
  getPageMetaByUrl,
  getAllPageMetasForAdmin,
} from '../controllers/pageMetaController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllMetaDataSchema } from '../routevalidators/getAllMetaData';
import { JSONSchemaType } from 'ajv';
import { createPageMetaSchema } from '../routevalidators/createMetaData';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllMetaDataSchema as JSONSchemaType<unknown>),
  getAllPageMetasForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(createPageMetaSchema as JSONSchemaType<unknown>),
  createPageMeta,
);
router.put(
  '/:id',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(createPageMetaSchema as JSONSchemaType<unknown>),
  updatePageMetaById,
);
router.delete('/:id', userAuthMiddleware, deletePageMetaById);
router.post('/page-data', sanitizeBody, getPageMetaByUrl);
router.get('/:id', userAuthMiddleware, getPageMetaById);

export default router;
