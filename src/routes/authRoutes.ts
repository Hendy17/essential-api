import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { 
  registerValidation, 
  loginValidation, 
  changePasswordValidation,
  updateProfileValidation 
} from '../utils/validation';

const router = Router();

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', registerValidation, AuthController.register);

// @route   POST /api/auth/login
// @desc    Login de usuário
// @access  Public
router.post('/login', loginValidation, AuthController.login);

// @route   POST /api/auth/refresh
// @desc    Renovar tokens de acesso
// @access  Public
router.post('/refresh', AuthController.refreshToken);

// @route   GET /api/auth/profile
// @desc    Obter perfil do usuário
// @access  Private
router.get('/profile', authenticate, AuthController.getProfile);

// @route   PUT /api/auth/profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/profile', authenticate, updateProfileValidation, AuthController.updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Alterar senha do usuário
// @access  Private
router.put('/change-password', authenticate, changePasswordValidation, AuthController.changePassword);

// @route   POST /api/auth/logout
// @desc    Logout de usuário
// @access  Private
router.post('/logout', authenticate, AuthController.logout);

export default router;