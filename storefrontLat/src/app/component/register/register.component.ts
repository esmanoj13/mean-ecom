import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  registerForm = this.fb.group({
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
  });
  get formValidation() {
    return this.registerForm.controls;
  }
  addRegister() {
    let value = this.registerForm.value;
    console.log(value);
    this.authService
      .onRegister(value.name!, value.email!, value.password!)
      .subscribe((data) => {
        this.router.navigateByUrl('/login');
      });
  }
  login() {
    this.router.navigateByUrl('/login');
  }
}
