import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  resetForm = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/),
        ],
      ],
      cpassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );
  constructor(private location: Location) {}
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.errorMessage = 'No token provided for password reset.';
      // Redirect to forgot password after 3 seconds
      setTimeout(() => this.router.navigateByUrl('/forgot-password'), 3000);
      return;
    }
  }
  onSubmit() {
    if (!this.resetForm.valid) {
      this.errorMessage = 'Please fix the form errors before submitting.';
      return;
    }

    const password = this.resetForm.value.password;
    if (!password) {
      this.errorMessage = 'Password is required.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resetPassword(this.token, password).subscribe({
      next: (response: any) => {
        this.successMessage =
          'Password reset successfully! Redirecting to login...';
        this.resetForm.reset();
        setTimeout(() => this.router.navigateByUrl('/login'), 3000);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Error resetting password. Please try again.';
      },
    });
  }
  get formValidation() {
    return this.resetForm.controls;
  }
  sendResetLink() {}
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('cpassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  goBack() {
    this.router.navigateByUrl('/login');
    // this.location.back();
  }
}
