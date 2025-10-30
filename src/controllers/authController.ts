import { Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { JWTUtils } from '../utils/jwtUtils';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static register = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        status: 'error',
        message: 'User already exists with this email'
      });
      return;
    }

    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    const tokens = JWTUtils.generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        ...tokens
      }
    });
  });

  static login = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email, isActive: true }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
      return;
    }

    const tokens = JWTUtils.generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        ...tokens
      }
    });
  });

  static refreshToken = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        status: 'error',
        message: 'Refresh token is required'
      });
      return;
    }

    try {
      const decoded = JWTUtils.verifyToken(refreshToken);
      
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        res.status(401).json({
          status: 'error',
          message: 'User not found or inactive'
        });
        return;
      }

      const tokens = JWTUtils.generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      });

      res.status(200).json({
        status: 'success',
        message: 'Tokens refreshed successfully',
        data: tokens
      });
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }
  });

  static getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  });

  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  });

  static changePassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    
    if (!user || !(await user.comparePassword(currentPassword))) {
      res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  });

  static logout = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }


    res.status(200).json({
      status: 'success',
      message: 'Logout successful'
    });
  });
}