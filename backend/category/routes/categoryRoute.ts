import { Router } from 'express';
import {
  createCategory,
  deleteCategoryById,
  updateCategoryById,
  getAllCategories,
  getCategoryById,
  getAllCategoriesForAdmin,
} from '../controllers/categoryController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllCategorySchema } from '../routevalidators/getAllCategory';
import { JSONSchemaType } from 'ajv';
import { createCategorySchema } from '../routevalidators/createCategory';
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';

const router = Router();

router.get(
  '/all',
  validateQuery(getAllCategorySchema as JSONSchemaType<unknown>),
  getAllCategories,
);
router.get(
  '/adminAll',
  requireAdmin,
  validateQuery(getAllCategorySchema as JSONSchemaType<unknown>),
  getAllCategoriesForAdmin,
);
router.post(
  '/',
  requireAdmin,
  validateReqBody(createCategorySchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createCategory,
);
router.put(
  '/:id',
  requireAdmin,
  validateReqBody(createCategorySchema as JSONSchemaType<unknown>),
  sanitizeBody,
  updateCategoryById,
);
router.delete('/:id', requireAdmin, deleteCategoryById);
router.get('/:id', requireAdmin, getCategoryById);

export default router;
