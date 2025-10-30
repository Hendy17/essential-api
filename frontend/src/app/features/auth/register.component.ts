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
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>person_add</mat-icon>
            Criar Conta
          </mat-card-title>
          <mat-card-subtitle>
            Preencha os dados para criar sua conta
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome completo</mat-label>
              <input matInput formControlName="name" placeholder="Seu nome completo">
              <mat-icon matSuffix>person</mat-icon>
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

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="seu@email.com">
              <mat-icon matSuffix>email</mat-icon>
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

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'">
              <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
                <mat-icon>{{ hidePassword() ? 'visibility' : 'visibility_off' }}</mat-icon>
              </button>
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

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar senha</mat-label>
              <input matInput formControlName="confirmPassword" [type]="hideConfirmPassword() ? 'password' : 'text'">
              <button mat-icon-button matSuffix type="button" (click)="toggleConfirmPasswordVisibility()">
                <mat-icon>{{ hideConfirmPassword() ? 'visibility' : 'visibility_off' }}</mat-icon>
              </button>
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

            @if (errorMessage()) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                {{ errorMessage() }}
              </div>
            }

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="registerForm.invalid || loading()"
                      class="full-width">
                @if (loading()) {
                  <mat-spinner diameter="20"></mat-spinner>
                  Criando conta...
                } @else {
                  <mat-icon>person_add</mat-icon>
                  Criar conta
                }
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <mat-divider></mat-divider>
          <div class="auth-footer">
            <p>Já tem uma conta?</p>
            <button mat-button color="accent" (click)="goToLogin()">
              Fazer login
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
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  registerForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

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

      this.authService.register(userData).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.router.navigate(['/tasks']);
          }
          this.loading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.userMessage || 'Erro ao criar conta');
          this.loading.set(false);
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}