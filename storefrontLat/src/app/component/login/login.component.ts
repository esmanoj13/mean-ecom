import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatFormFieldModule,
    MatError,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  errorMessage: string = '';
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/),
      ],
    ],
  });
  get formValidation() {
    return this.loginForm.controls;
  }
  addLogin(event: Event) {
    event.preventDefault();
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authService
      .onLogin(email!, password!)
      .pipe(
        catchError((error) => {
          this.errorMessage =
            error?.error?.message || 'Invalid email or password.';
          console.error('Login failed', error);
          return of(null);
        })
      )
      .subscribe({
        next: (data: any) => {
          if (!data) {
            return;
          }
          // AuthService handles token storage via tap operator
          if (data.user?.isAdmin) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Login failed';
        },
      });
  }
  register() {
    this.router.navigateByUrl('/register');
  }
  forgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
  goBack() {
    this.router.navigateByUrl('/');
  }
}
