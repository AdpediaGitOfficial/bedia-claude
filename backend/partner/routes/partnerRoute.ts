import { Router } from 'express';
import {
  createPartner,
  deletePartnerById,
  updatePartnerById,
  getAllPartners,
  getPartnerById,
  getAllPartnersForAdmin,
} from '../controllers/partnerController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllPartnersSchema } from '../routevalidators/getAllPartners';
import { JSONSchemaType } from 'ajv';
import { createPartnerSchema } from '../routevalidators/createPartner';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllPartnersSchema as JSONSchemaType<unknown>), getAllPartners);

router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllPartnersSchema as JSONSchemaType<unknown>),
  getAllPartnersForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(createPartnerSchema as JSONSchemaType<unknown>),
  createPartner,
);
router.put(
  '/:id',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(createPartnerSchema as JSONSchemaType<unknown>),
  updatePartnerById,
);
router.delete('/:id', userAuthMiddleware, deletePartnerById);
router.get('/:id', userAuthMiddleware, getPartnerById);

export default router;
