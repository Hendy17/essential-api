import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, RegisterRequest } from '../../core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-content">
        <div class="auth-header">
          <div class="logo-section">
            <h1>TaskManager</h1>
          </div>
          <p class="welcome-text">Crie sua conta!</p>
          <p class="subtitle">Preencha os dados para criar sua conta</p>
        </div>

        <mat-card class="auth-card">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nome completo</mat-label>
                <input matInput formControlName="name" placeholder="Seu nome completo">
                @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
                  <mat-error>
                    @if (registerForm.get('name')?.errors?.['required']) {
                      Nome é obrigatório
                    }
                    @if (registerForm.get('name')?.errors?.['minlength']) {
                      Nome deve ter pelo menos 2 caracteres
                    }
                  </mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-group">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" placeholder="seu@email.com">
                @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                  <mat-error>
                    @if (registerForm.get('email')?.errors?.['required']) {
                      Email é obrigatório
                    }
                    @if (registerForm.get('email')?.errors?.['email']) {
                      Email inválido
                    }
                  </mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-group">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Senha</mat-label>
                <input matInput formControlName="password" type="password" placeholder="Digite sua senha">
                @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                  <mat-error>
                    @if (registerForm.get('password')?.errors?.['required']) {
                      Senha é obrigatória
                    }
                    @if (registerForm.get('password')?.errors?.['minlength']) {
                      Senha deve ter pelo menos 6 caracteres
                    }
                    @if (registerForm.get('password')?.errors?.['pattern']) {
                      Senha deve conter ao menos uma letra maiúscula, minúscula e um número
                    }
                  </mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-group">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Confirmar senha</mat-label>
                <input matInput formControlName="confirmPassword" type="password" placeholder="Confirme sua senha">
                @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
                  <mat-error>
                    @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                      Confirmação de senha é obrigatória
                    }
                    @if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                      Senhas não coincidem
                    }
                  </mat-error>
                }
              </mat-form-field>
            </div>

            @if (errorMessage()) {
              <div class="error-message">
                <mat-icon>error_outline</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="registerForm.invalid || loading()"
                      class="register-button">
                @if (loading()) {
                  <mat-spinner diameter="20" color="accent"></mat-spinner>
                  <span>Criando conta...</span>
                } @else {
                  Criar conta
                }
              </button>
            </div>

            <div class="divider">
              <span>ou</span>
            </div>

            <div class="login-section">
              <p>Já possui uma conta?</p>
              <button mat-button color="accent" type="button" (click)="goToLogin()" class="login-link">
                Fazer login
              </button>
            </div>
          </form>
        </mat-card>
      </div>
      
      <div class="auth-background">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    }

    .auth-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      z-index: 2;
      position: relative;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 40px;
      color: white;
    }

    .logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .auth-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(45deg, #ffffff, #e3f2fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .welcome-text {
      font-size: 1.5rem;
      font-weight: 500;
      margin: 8px 0;
      opacity: 0.95;
    }

    .subtitle {
      font-size: 1rem;
      opacity: 0.8;
      margin: 0;
      font-weight: 400;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 40px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.1),
        0 8px 32px rgba(0, 0, 0, 0.08);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      position: relative;
    }

    .full-width {
      width: 100%;
    }

    .full-width ::ng-deep .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    .full-width ::ng-deep .mat-mdc-text-field-wrapper {
      border-radius: 12px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #d32f2f;
      font-size: 14px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #ffebee, #fce4ec);
      border-radius: 12px;
      border-left: 4px solid #d32f2f;
      margin-top: -8px;
    }

    .error-message mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .form-actions {
      margin-top: 8px;
    }

    .register-button {
      width: 100%;
      height: 56px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 600;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: linear-gradient(135deg, #667eea, #764ba2) !important;
      color: white !important;
      border: none !important;
      box-shadow: 
        0 8px 24px rgba(102, 126, 234, 0.3),
        0 4px 12px rgba(118, 75, 162, 0.2);
      transition: all 0.3s ease;
      text-transform: none !important;
      line-height: 1 !important;
    }

    .register-button .mdc-button__label {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100%;
      gap: 8px;
    }

    .register-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 
        0 12px 32px rgba(102, 126, 234, 0.4),
        0 6px 16px rgba(118, 75, 162, 0.3);
    }

    .register-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .register-button mat-spinner {
      margin-right: 8px;
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 32px 0;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
    }

    .divider span {
      background: white;
      padding: 0 20px;
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .login-section {
      text-align: center;
    }

    .login-section p {
      margin: 0 0 16px 0;
      color: #666;
      font-size: 14px;
    }

    .login-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 500;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      transition: all 0.3s ease;
    }

    .login-link:hover {
      background: rgba(102, 126, 234, 0.15);
      transform: translateY(-1px);
    }

    .auth-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      overflow: hidden;
    }

    .floating-shapes {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      animation: float 8s ease-in-out infinite;
      opacity: 0.2;
      pointer-events: none;
    }

    .shape-1 {
      width: 120px;
      height: 120px;
      top: 15%;
      left: 5%;
      animation-delay: -2s;
    }

    .shape-2 {
      width: 80px;
      height: 80px;
      top: 70%;
      right: 10%;
      animation-delay: -4s;
    }

    .shape-3 {
      width: 60px;
      height: 60px;
      bottom: 25%;
      left: 80%;
      animation-delay: -1s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.3;
      }
      50% {
        transform: translateY(-15px) rotate(180deg);
        opacity: 0.1;
      }
    }

    @media (max-width: 768px) {
      .auth-content {
        padding: 20px 16px;
      }

      .auth-header h1 {
        font-size: 2rem;
      }

      .welcome-text {
        font-size: 1.25rem;
      }

      .auth-card {
        padding: 24px;
        max-width: 100%;
      }

      .floating-shapes {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 20px;
        border-radius: 16px;
      }

      .register-button {
        height: 48px;
        font-size: 14px;
      }
    }
  `]
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  registerForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      const userData: RegisterRequest = this.registerForm.value;
      console.log('Dados sendo enviados:', userData); // Debug log

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Response:', response); // Debug log
          if (response.status === 'success') {
            this.router.navigate(['/tasks']);
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Erro de registro:', error); // Debug log
          this.errorMessage.set(error.userMessage || 'Erro ao criar conta');
          this.loading.set(false);
        }
      });
    } else {
      console.log('Form is invalid:', this.registerForm.errors); // Debug log
      console.log('Form values:', this.registerForm.value); // Debug log
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}