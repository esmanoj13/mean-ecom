import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Register } from '../../types/data-types';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  errorMessage: string = '';
  successMessage: string = '';
  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/),
        ],
      ],
      cpassword: ['', Validators.required],
      address1: ['', [Validators.required]],
      address2: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      state: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      country: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      pincode: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      contact: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
        ],
      ],
    },
    { validators: this.passwordMatchValidator }
  );
  get formValidation() {
    return this.registerForm.controls;
  }
  addRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    // Check form validity
    if (this.registerForm.invalid) {
      const errors = [];
      const controls = this.registerForm.controls;

      if (controls.name.errors)
        errors.push('Name is required and must be at least 5 characters');
      if (controls.email.errors)
        errors.push('Please enter a valid email address');
      if (controls.password.errors) {
        if (controls.password.errors['minlength']) {
          errors.push('Password must be at least 8 characters');
        }
        if (controls.password.errors['pattern']) {
          errors.push(
            'Password must contain at least one uppercase letter and one special character'
          );
        }
      }
      if (
        controls.cpassword.errors ||
        this.registerForm.errors?.['passwordMismatch']
      ) {
        errors.push('Passwords do not match');
      }
      if (controls.contact.errors) {
        errors.push('Please enter a valid 10-digit contact number');
      }

      this.errorMessage = errors.join('. ');
      return;
    }

    const formValue = this.registerForm.value;

    // Create payload with proper type checking
    const payload: Register = {
      name: formValue.name!,
      email: formValue.email!,
      password: formValue.password!,
      address: {
        address1: formValue.address1!,
        address2: formValue.address2!,
        city: formValue.city!,
        state: formValue.state!,
        country: formValue.country!,
        pincode: Number(formValue.pincode!),
        contact: Number(formValue.contact!),
      },
    };

    this.authService.onRegister(payload).subscribe({
      next: (response) => {
        this.successMessage =
          'Registration successful! Redirecting to login...';
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Registration failed. Please try again later.';
        }
        console.error('Registration error:', err);
      },
    });
  }
  login() {
    this.router.navigateByUrl('/login');
  }
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('cpassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
