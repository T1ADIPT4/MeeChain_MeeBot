import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.headers['role'];
    if (!allowedRoles.includes(role as string)) {
      return res.status(403).json({ success: false, message: 'Access denied: insufficient role' });
    }
    next();
  };
};

export const verifyTokenAndRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Missing token' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      if (!allowedRoles.includes((decoded as any).role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      (req as any).user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};
