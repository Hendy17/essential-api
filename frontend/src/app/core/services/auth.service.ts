import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest, AuthResponse, User, ApiResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkTokenValidity();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🔐 AuthService.login called with:', credentials);
    console.log('🌐 API URL:', `${this.API_URL}/auth/login`);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('📡 Login response:', response);
          if (response.status === 'success' && response.data) {
            console.log('💾 Setting auth data');
            this.setAuthData(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          if (response.status === 'success' && response.data) {
            this.setAuthData(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/logout`, {})
      .pipe(
        tap(() => this.clearAuthData()),
        catchError(() => {
          this.clearAuthData();
          return throwError(() => new Error('Logout failed'));
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.clearAuthData();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/refresh`, { 
      refreshToken 
    }).pipe(
      tap(response => {
        if (response.status === 'success' && response.data) {
          this.setAuthData(response.data);
        }
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/auth/profile`)
      .pipe(
        tap(response => {
          if (response.status === 'success' && response.data) {
            this.updateCurrentUser(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  getCurrentUser(): User | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  getAccessToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private setAuthData(authData: AuthResponse['data']): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, authData.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
    }
    
    this.currentUserSubject.next(authData.user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearAuthData(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    this.router.navigate(['/auth/login']);
  }

  
  private updateCurrentUser(user: User): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  private checkTokenValidity(): void {
    if (!this.hasValidToken()) {
      this.clearAuthData();
    }
  }

  private handleError = (error: any): Observable<never> => {
    console.error('🚨 Auth Service Error:', error);
    console.error('📊 Error status:', error.status);
    console.error('📝 Error message:', error.message);
    console.error('📦 Error details:', error.error);
    
    if (error.status === 401) {
      this.clearAuthData();
    }
    
    let errorMessage = 'Ocorreu um erro inesperado';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.errors && Array.isArray(error.error.errors)) {
      errorMessage = error.error.errors.map((err: any) => err.msg || err.message).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.log('📢 Final error message:', errorMessage);
    return throwError(() => ({ ...error, userMessage: errorMessage }));
  };
}