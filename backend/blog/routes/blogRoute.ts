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
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllBlogsSchema as JSONSchemaType<unknown>), getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/meta/:slug', getBlogMetaBySlug);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAdminAllBlogsSchema as JSONSchemaType<unknown>),
  getAllBlogsForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(blogBodySchema as JSONSchemaType<unknown>),
  createBlog,
);
router.post('/xml', multerConfig.multipleFileUpload(), fetchFromXml);
router.put(
  '/:id',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(blogBodySchema as JSONSchemaType<unknown>),
  updateBlogById,
);
router.delete('/:id', userAuthMiddleware, deleteBlogById);
router.get('/:id', userAuthMiddleware, getBlogById);

export default router;
