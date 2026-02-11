import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LoginService } from '../shared/services/login.service';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const ERROR_CONFIG: Record<
  number,
  { severity: 'error' | 'warn' | 'info'; summary: string; life?: number }
> = {
  400: { severity: 'error', summary: 'Bad Request' },
  401: { severity: 'error', summary: 'Unauthorized' },
  403: { severity: 'error', summary: 'Forbidden' },
  404: { severity: 'error', summary: 'Not Found' },
  409: { severity: 'warn', summary: 'Conflict' },
  422: { severity: 'warn', summary: 'Validation Error', life: 5000 },
  500: { severity: 'error', summary: 'Server Error' },
};

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('authToken');
  const loginService = inject(LoginService);
  const messageService = inject(MessageService);
  const clonedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(clonedReq).pipe(
    catchError((err) => {
      const errorResponse = err.error;
      const errorMessage = errorResponse?.message || 'An error occurred';
      const errorDetails = errorResponse?.details;

      let displayMessage = errorMessage;
      if (errorDetails) {
        displayMessage += ` - ${errorDetails}`;
      }

      const config = ERROR_CONFIG[err.status];
      if (config) {
        messageService.add({
          severity: config.severity,
          summary: config.summary,
          detail: displayMessage,
          life: config.life || 4000,
        });
      }

      if (err.status === 401 && token) {
        loginService.logout();
      }

      return throwError(() => err);
    })
  );
};
