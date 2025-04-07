import express from 'express';
import { getDashboardStats, getLoansByMonth, getLoansByStatus } from '../controllers/dashboardController';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = express.Router();

// Dashboard stats (admin only)
router.get('/stats', authenticate, authorizeRoles('admin'), getDashboardStats);
router.get('/loans-by-month', authenticate, authorizeRoles('admin'), getLoansByMonth);
router.get('/loans-by-status', authenticate, authorizeRoles('admin'), getLoansByStatus);

export default router;