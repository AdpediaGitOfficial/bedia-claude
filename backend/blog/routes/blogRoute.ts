import { Router } from 'express';
import {
  createBlog,
  deleteBlogById,
  updateBlogById,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  fetchFromXml,
  getAllBlogsForAdmin,
  getBlogMetaBySlug,
} from '../controllers/blogController';
import multerConfig from '../../middleware/multer';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAdminAllBlogsSchema } from '../routevalidators/getAdminAll';
import { getAllBlogsSchema } from '../routevalidators/getAllBlogs';
import { JSONSchemaType } from 'ajv';
import { blogBodySchema } from '../routevalidators/createBlog';
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllBlogsSchema as JSONSchemaType<unknown>), getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/meta/:slug', getBlogMetaBySlug);
router.get(
  '/adminAll',
  requireAdmin,
  validateQuery(getAdminAllBlogsSchema as JSONSchemaType<unknown>),
  getAllBlogsForAdmin,
);
router.post(
  '/',
  requireAdmin,
  sanitizeBody,
  validateReqBody(blogBodySchema as JSONSchemaType<unknown>),
  createBlog,
);
router.post('/xml', multerConfig.multipleFileUpload(), fetchFromXml);
router.put(
  '/:id',
  requireAdmin,
  sanitizeBody,
  validateReqBody(blogBodySchema as JSONSchemaType<unknown>),
  updateBlogById,
);
router.delete('/:id', requireAdmin, deleteBlogById);
router.get('/:id', requireAdmin, getBlogById);

export default router;
