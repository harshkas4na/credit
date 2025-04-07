import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthPayload {
  userId: string;
  role: 'verifier' | 'admin';
}

// Extending the Express Request interface
interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as AuthPayload;
    // Using type assertion to safely assign the user property
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};