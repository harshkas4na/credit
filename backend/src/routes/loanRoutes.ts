import express from 'express';
import { 
  createLoanApplication, 
  getAllLoanApplications, 
  updateLoanStatus,
  getUserLoanApplications
} from '../controllers/loanController';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = express.Router();

// Create a new loan application (both verifier and admin)
router.post('/', authenticate, authorizeRoles('verifier', 'admin'), createLoanApplication);

// Get all loan applications (admin only)
router.get('/', authenticate, authorizeRoles('admin'), getAllLoanApplications);

// Get user's own loan applications
router.get('/my-loans', authenticate, getUserLoanApplications);

// Update loan status (both roles, but with restrictions in controller)
router.patch('/:id/status', authenticate, authorizeRoles('admin', 'verifier'), updateLoanStatus);

export default router;