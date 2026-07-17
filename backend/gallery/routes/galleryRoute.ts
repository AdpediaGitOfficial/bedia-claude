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
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllGallerySchema as JSONSchemaType<unknown>), getAllGalleries);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllGallerySchema as JSONSchemaType<unknown>),
  getAllGalleriesForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  validateReqBody(createGallerySchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createGallery,
);
router.put(
  '/:id',
  userAuthMiddleware,
  validateReqBody(createGallerySchema as JSONSchemaType<unknown>),
  sanitizeBody,
  updateGalleryById,
);
router.delete('/:id', userAuthMiddleware, deleteGalleryById);
router.get('/:id', userAuthMiddleware, getGalleryById);

export default router;
