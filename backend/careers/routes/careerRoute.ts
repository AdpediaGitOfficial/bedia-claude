import { Router } from 'express';
import {
  createCareer,
  deleteCareerById,
  updateCareerById,
  getAllCareers,
  getCareerById,
  getCareerBySlug,
  getAllCareersForAdmin,
  createJobApplication,
  getAllJobApplications,
  getCareerMetaBySlug,
} from '../controllers/careerController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllCareerSchema } from '../routevalidators/getAllCareers';
import { JSONSchemaType } from 'ajv';
import multerConfig from '../../middleware/multer';
import { createCareerSchema } from '../routevalidators/createCareer';
import { createJobApplicationSchema } from '../routevalidators/createJobApplication';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.get('/all', validateQuery(getAllCareerSchema as JSONSchemaType<unknown>), getAllCareers);
router.get(
  '/job-application/all',
  userAuthMiddleware,
  validateQuery(getAllCareerSchema as JSONSchemaType<unknown>),
  getAllJobApplications,
);
router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllCareerSchema as JSONSchemaType<unknown>),
  getAllCareersForAdmin,
);
router.post(
  '/job-application',
  sanitizeBody,
  multerConfig.singleFileUpload('resume'),
  validateReqBody(createJobApplicationSchema as JSONSchemaType<unknown>),
  createJobApplication,
);
router.post(
  '/',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(createCareerSchema as JSONSchemaType<unknown>),
  createCareer,
);
router.put(
  '/:id',
  userAuthMiddleware,
  sanitizeBody,
  validateReqBody(createCareerSchema as JSONSchemaType<unknown>),
  updateCareerById,
);
router.delete('/:id', userAuthMiddleware, deleteCareerById);
router.get('/slug/:slug', getCareerBySlug);
router.get('/meta/:slug', getCareerMetaBySlug);
router.get('/:id', userAuthMiddleware, getCareerById);

export default router;
