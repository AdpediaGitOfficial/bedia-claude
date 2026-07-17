import { Router } from 'express';
import { getDashboardStats, getDailyNewUsersChart } from '../controllers/dashboardController';
import { authenticateAdmin } from '../../middleware/authentication';

const router = Router();

router.get('/stats', authenticateAdmin, getDashboardStats);
router.get('/chart/new-users', authenticateAdmin, getDailyNewUsersChart);

export default router;
