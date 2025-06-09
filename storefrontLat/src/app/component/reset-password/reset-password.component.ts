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
      console.error('No token provided for password reset.');
      return;
    }
  }
  onSubmit() {
    //   if (this.resetForm.valid) {
    //     const { password, cpassword } = this.resetForm.value;
    //     if (!password || !cpassword) {
    //       console.log('Password and confirm password are required.');
    //       return;
    //     }
    //   }
    const password = this.resetForm.value.password;
    if (!password) return;
    this.authService.resetPassword(this.token, password).subscribe({
      next: () => console.log('Reset link sent to your email.'),
      error: () => console.log('Error sending reset link.'),
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
