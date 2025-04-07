import { Request, Response, NextFunction } from 'express';

// Define interface for authenticated request
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'verifier' | 'admin';
  };
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    const user = authReq.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};