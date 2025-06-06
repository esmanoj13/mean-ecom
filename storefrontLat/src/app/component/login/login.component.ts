import { afterNextRender, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, RouterModule],
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
      console.warn('invalid form submission');
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
          return of(null); // Handle error gracefully
        })
      )
      .subscribe((data: any) => {
        if (!data || !data.token) {
          console.log('No token is recived,login failed');
          return;
        }
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          this.router.navigateByUrl('/');
        }
      });
  }
  register() {
    this.router.navigateByUrl('/register');
  }
}
