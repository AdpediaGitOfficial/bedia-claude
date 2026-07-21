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
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllPartnersSchema as JSONSchemaType<unknown>), getAllPartners);

router.get(
  '/adminAll',
  requireAdmin,
  validateQuery(getAllPartnersSchema as JSONSchemaType<unknown>),
  getAllPartnersForAdmin,
);
router.post(
  '/',
  requireAdmin,
  sanitizeBody,
  validateReqBody(createPartnerSchema as JSONSchemaType<unknown>),
  createPartner,
);
router.put(
  '/:id',
  requireAdmin,
  sanitizeBody,
  validateReqBody(createPartnerSchema as JSONSchemaType<unknown>),
  updatePartnerById,
);
router.delete('/:id', requireAdmin, deletePartnerById);
router.get('/:id', requireAdmin, getPartnerById);

export default router;
