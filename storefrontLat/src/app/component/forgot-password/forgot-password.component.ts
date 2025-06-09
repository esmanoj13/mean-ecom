import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  constructor(private location: Location) {}
  successMessage: string = '';
  errorMessage: string = '';
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  onSubmit() {
    const email = this.forgotForm.value.email;
    if (!email) {
      return;
    }
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.successMessage = 'Reset link sent to your email.';
        this.forgotForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Something went wrong';
      },
    });
  }
  get formValidation() {
    return this.forgotForm.controls;
  }
  sendResetLink() {}
  goBack() {
    this.location.back();
  }
}
