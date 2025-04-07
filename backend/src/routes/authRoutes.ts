import express from 'express';
import { register, login, getAllUsers, deleteUser, updateUserRole } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Admin only routes
router.get('/users', authenticate, authorizeRoles('admin'), getAllUsers);
router.delete('/users/:id', authenticate, authorizeRoles('admin'), deleteUser);
router.patch('/users/:id/role', authenticate, authorizeRoles('admin'), updateUserRole);

export default router;