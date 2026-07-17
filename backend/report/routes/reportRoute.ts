import { Router } from 'express';
import { uploadReport, getReport } from '../controllers/reportController';
import multerConfig from '../../middleware/multer';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.post('/', userAuthMiddleware, multerConfig.multipleFileUpload(), uploadReport);
router.get('/', userAuthMiddleware, getReport);

export default router;
