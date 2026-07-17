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
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get(
  '/all',
  validateQuery(getAllCategorySchema as JSONSchemaType<unknown>),
  getAllCategories,
);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllCategorySchema as JSONSchemaType<unknown>),
  getAllCategoriesForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  validateReqBody(createCategorySchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createCategory,
);
router.put(
  '/:id',
  userAuthMiddleware,
  validateReqBody(createCategorySchema as JSONSchemaType<unknown>),
  sanitizeBody,
  updateCategoryById,
);
router.delete('/:id', userAuthMiddleware, deleteCategoryById);
router.get('/:id', userAuthMiddleware, getCategoryById);

export default router;
