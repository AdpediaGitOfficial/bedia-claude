import { Router } from 'express';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';
import { createLeadController, getLeadsController } from '../controllers/customLeadControllers';

const router = Router();

router.post('/:type', createLeadController);
router.get('/all/:type', userAuthMiddleware, getLeadsController);

export default router;
