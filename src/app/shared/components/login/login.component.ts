import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  loginService = inject(LoginService);
  constructor(private messageService: MessageService) {}

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

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginService
      .login({
        email: this.email!.value!,
        password: this.password!.value!,
      })
      .subscribe({
        next: () => {
          this.loginForm.reset();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Message Content',
          });
        },
      });
  }
}
