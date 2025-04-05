import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || "doctorBuddy"

export const verifyToken = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Please authenticate yourself' });
    }
    
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log({err})
        return res.status(403).json({ message: 'Invalid token' });
      }
      next();
    });
  };
};