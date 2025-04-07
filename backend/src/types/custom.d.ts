declare namespace Express {
    export interface Request {
      user?: {
        userId: string;
        role: 'verifier' | 'admin';
      };
    }
  }