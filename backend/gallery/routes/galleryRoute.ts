import { Router } from 'express';
import {
  createGallery,
  deleteGalleryById,
  updateGalleryById,
  getAllGalleries,
  getGalleryById,
  getAllGalleriesForAdmin,
} from '../controllers/galleryController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllGallerySchema } from '../routevalidators/getAllGallery';
import { JSONSchemaType } from 'ajv';
import { createGallerySchema } from '../routevalidators/createGallery';
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllGallerySchema as JSONSchemaType<unknown>), getAllGalleries);
router.get(
  '/adminAll',
  requireAdmin,
  validateQuery(getAllGallerySchema as JSONSchemaType<unknown>),
  getAllGalleriesForAdmin,
);
router.post(
  '/',
  requireAdmin,
  validateReqBody(createGallerySchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createGallery,
);
router.put(
  '/:id',
  requireAdmin,
  validateReqBody(createGallerySchema as JSONSchemaType<unknown>),
  sanitizeBody,
  updateGalleryById,
);
router.delete('/:id', requireAdmin, deleteGalleryById);
router.get('/:id', requireAdmin, getGalleryById);

export default router;
