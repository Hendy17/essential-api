import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwtUtils';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../models/Auth';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Access token is required'
      });
      return;
    }

    const decoded = JWTUtils.verifyToken(token);

    const user = await User.findById(decoded.userId).select('+isActive');
    
    if (!user || !user.isActive) {
      res.status(401).json({
        status: 'error',
        message: 'User not found or inactive'
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    res.status(401).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Authentication failed'
    });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      status: 'error',
      message: 'Admin access required'
    });
    return;
  }

  next();
};

export const requireOwnershipOrAdmin = (resourceUserIdField: string = 'userId') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    if (req.user.role === 'admin') {
      return next();
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId !== req.user.id) {
      res.status(403).json({
        status: 'error',
        message: 'Access denied: insufficient permissions'
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = JWTUtils.verifyToken(token);
      const user = await User.findById(decoded.userId).select('+isActive');
      
      if (user && user.isActive) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role
        };
      }
    }

    next();
  } catch (error) {
    next();
  }
};