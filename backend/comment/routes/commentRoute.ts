import { Router } from 'express';
import {
  createComment,
  deleteCommentById,
  getCommentsByPostId,
  likeComment,
  unlikeComment,
  updateCommentById,
} from '../controllers/commentController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { JSONSchemaType } from 'ajv';
import { commentBodySchema } from '../routevalidators/createComment';
import { commentUpdateBodySchema } from '../routevalidators/updateComment';
import { getAllCommentsSchema } from '../routevalidators/getAllComments';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get(
  '/post/:postId',
  validateQuery(getAllCommentsSchema as JSONSchemaType<unknown>),
  getCommentsByPostId,
);
router.post(
  '/',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(commentBodySchema as JSONSchemaType<unknown>),
  createComment,
);
router.put(
  '/:id',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(commentUpdateBodySchema as JSONSchemaType<unknown>),
  updateCommentById,
);
router.delete('/:id', userAuthMiddleware, deleteCommentById);
router.post('/:id/like', userAuthMiddleware, likeComment);
router.post('/:id/unlike', userAuthMiddleware, unlikeComment);

export default router;
