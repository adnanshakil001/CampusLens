import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      fullName: string;
      role: string;
    }

    interface Request {
      user?: User;
    }
  }
}
