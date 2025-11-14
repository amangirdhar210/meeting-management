import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { LoginRequest, LoginResponse } from '../models/api.model';
import { API_ENDPOINTS } from '../constants';

interface DecodedToken {
  user_id: number;
  role: 'admin' | 'user';
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  isLoggedIn = signal<boolean>(false);

  constructor() {
    this.restoreSession();
  }

  get userRole(): 'admin' | 'user' | 'unauthenticated' {
    const token = localStorage.getItem('authToken');
    if (!token) return 'unauthenticated';
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.role;
    } catch {
      return 'unauthenticated';
    }
  }

  get isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  get isUser(): boolean {
    return this.userRole === 'user';
  }

  get userId(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.user_id;
    } catch {
      return null;
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials).pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem('authToken', res.token);
        this.isLoggedIn.set(true);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
        });
        const decoded = jwtDecode<DecodedToken>(res.token);
        if (decoded.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (decoded.role === 'user') {
          this.router.navigate(['/user-dashboard']);
        }
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'Login failed',
        });
        throw error;
      })
    );
  }

  logout(): void {
    this.isLoggedIn.set(false);
    localStorage.removeItem('authToken');
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Logged out successfully',
    });
    this.router.navigate(['/login']);
  }

  private restoreSession(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 > Date.now()) {
          this.isLoggedIn.set(true);
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
    }
  }
}
