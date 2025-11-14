import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private loginService = inject(LoginService);

  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      const role = this.loginService.userRole;
      if (role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else if (role === 'user') {
        this.router.navigate(['/user-dashboard']);
      }
    }
  }

  get email(): FormControl<string> {
    return this.loginForm.get('email') as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.loginForm.get('password') as FormControl<string>;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.loginForm.reset();
      },
      error: () => {},
    });
  }
}
