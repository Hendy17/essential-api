export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive?: boolean;
  createdAt?: Date | string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}