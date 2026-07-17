import { Router } from 'express';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { JSONSchemaType } from 'ajv';
import { communityPropertyBodySchema } from '../routevalidators/createProperty';
import { validateQuery, validateReqBody } from '../../middleware/validate';

import {
  createCommunity,
  deleteCommunity,
  getAllCommunities,
  getCommunityBySlug,
  updateCommunity,
  addNewLaunchProject,
  getAllCommunityProjects,
  getCommunityProjectBySlug,
  updateNewLaunchProject,
} from '../controllers/communitycontroller';
import { getCommunityProjectsSchema } from '../routevalidators/getAllCommunityProjects';

const router = Router();

router.post('/create', userAuthMiddleware, createCommunity);
router.get('/all', getAllCommunities);
router.get('/:slug', getCommunityBySlug);
router.put('/:id', updateCommunity);
router.delete('/:id', deleteCommunity);
router.post(
  '/project/:communityId',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(communityPropertyBodySchema as JSONSchemaType<unknown>),
  addNewLaunchProject,
);

router.put(
  '/project/:communityId/:projectSlug',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(communityPropertyBodySchema as JSONSchemaType<unknown>),
  updateNewLaunchProject,
);

router.get(
  '/all-community-projects',
  validateQuery(getCommunityProjectsSchema as JSONSchemaType<unknown>),
  getAllCommunityProjects,
);

router.get('/community-projects/:communitySlug/:slug', getCommunityProjectBySlug);

export default router;
