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
import { AuthService, LoginRequest } from '../../core';

@Component({
  selector: 'app-login',
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
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>login</mat-icon>
            Fazer Login
          </mat-card-title>
          <mat-card-subtitle>
            Entre com suas credenciais para acessar o sistema
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="seu@email.com">
              <mat-icon matSuffix>email</mat-icon>
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <mat-error>
                  @if (loginForm.get('email')?.errors?.['required']) {
                    Email é obrigatório
                  }
                  @if (loginForm.get('email')?.errors?.['email']) {
                    Email inválido
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'">
              <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
                <mat-icon>{{ hidePassword() ? 'visibility' : 'visibility_off' }}</mat-icon>
              </button>
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <mat-error>
                  Senha é obrigatória
                </mat-error>
              }
            </mat-form-field>

            @if (errorMessage()) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                {{ errorMessage() }}
              </div>
            }

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="loginForm.invalid || loading()"
                      class="full-width">
                @if (loading()) {
                  <mat-spinner diameter="20"></mat-spinner>
                  Entrando...
                } @else {
                  <mat-icon>login</mat-icon>
                  Entrar
                }
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <mat-divider></mat-divider>
          <div class="auth-footer">
            <p>Não tem uma conta?</p>
            <button mat-button color="accent" (click)="goToRegister()">
              Criar conta
            </button>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 20px;
    }

    .full-width {
      width: 100%;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      font-size: 14px;
      padding: 8px;
      background-color: #ffebee;
      border-radius: 4px;
      border-left: 4px solid #f44336;

      mat-icon {
        font-size: 18px;
      }
    }

    .form-actions {
      margin-top: 10px;

      button {
        height: 48px;
        display: flex;
        align-items: center;
        gap: 8px;

        mat-spinner {
          margin-right: 8px;
        }
      }
    }

    .auth-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 16px 0 0 0;

      p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      .auth-container {
        padding: 10px;
      }

      .auth-card {
        padding: 16px;
      }
    }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  hidePassword = signal(true);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.router.navigate(['/tasks']);
          }
          this.loading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.userMessage || 'Erro ao fazer login');
          this.loading.set(false);
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}