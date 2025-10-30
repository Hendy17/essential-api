import jwt from 'jsonwebtoken';
import { JWTPayload } from '../models/Auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export class JWTUtils {
  // Gerar token de acesso
  static generateAccessToken(payload: { userId: string; email: string; role: string }): string {
    return jwt.sign(payload, JWT_SECRET);
  }

  // Gerar token de refresh
  static generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, JWT_SECRET);
  }

  // Verificar e decodificar token
  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  // Decodificar token sem verificar (para debug)
  static decodeToken(token: string): any {
    return jwt.decode(token);
  }

  // Verificar se token está expirado
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Extrair token do header Authorization
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1] || null;
  }

  // Gerar tokens de acesso e refresh
  static generateTokenPair(payload: { userId: string; email: string; role: string }) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken({ userId: payload.userId }),
      expiresIn: '7d'
    };
  }
}