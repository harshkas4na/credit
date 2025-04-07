import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/admin-only', authenticate, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

router.get('/verifier-only', authenticate, authorizeRoles('verifier'), (req, res) => {
  res.json({ message: 'Welcome, verifier!' });
});

router.get('/both', authenticate, authorizeRoles('admin', 'verifier'), (req, res) => {
  res.json({ message: 'Welcome, either role!' });
});

export default router;
