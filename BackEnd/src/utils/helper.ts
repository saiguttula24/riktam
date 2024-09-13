import { Response, NextFunction } from 'express';
import { LocalsRequest } from './types';

const jwt = require('jsonwebtoken');

export function verifyToken(req: LocalsRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1] || req.query.token;
  
    if (!token) return res.status(401).json({success: false, message: 'No token provided' });
  
    jwt.verify(token, process.env.JWT_SECRET as string, (err:any, decoded:any) => {
      if (err) return res.status(401).json({success:false, message: 'Failed to authenticate token' });
      
      if (decoded.exp * 1000 < Date.now()) return res.status(401).json({success:false, message: 'Token has expired' });
  
      req.locals = decoded;
  
      next();
    })
}
