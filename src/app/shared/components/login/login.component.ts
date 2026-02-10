import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { 
  ROUTES, 
  USER_ROLES, 
  FORM_CONTROLS, 
  VALIDATION_MESSAGES,
  UI_LABELS,
  BUTTON_LABELS,
  FORM_LABELS,
  PLACEHOLDERS,
  APP_INFO 
} from '../../constants/app.constants';

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
  
  readonly UI = UI_LABELS;
  readonly BUTTONS = BUTTON_LABELS;
  readonly LABELS = FORM_LABELS;
  readonly PLACEHOLDERS = PLACEHOLDERS;
  readonly VALIDATION = VALIDATION_MESSAGES;
  readonly APP_INFO = APP_INFO;
  
  isSubmitting = false;

  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(128),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/)
      ],
    }),
  });

  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      const role = this.loginService.userRole;
      if (role === USER_ROLES.ADMIN || role === USER_ROLES.SUPERADMIN) {
        this.router.navigate([ROUTES.ADMIN_DASHBOARD]);
      } else if (role === USER_ROLES.USER) {
        this.router.navigate([ROUTES.USER_DASHBOARD]);
      }
    }
  }

  get email(): FormControl<string> {
    return this.loginForm.get(FORM_CONTROLS.EMAIL) as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.loginForm.get(FORM_CONTROLS.PASSWORD) as FormControl<string>;
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.loginForm.reset();
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }
}
