import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth/adminRoleMiddleware';
import { createLeadController, getLeadsController } from '../controllers/customLeadControllers';

const router = Router();

router.post('/:type', createLeadController);
router.get('/all/:type', requireAdmin, getLeadsController);

export default router;
