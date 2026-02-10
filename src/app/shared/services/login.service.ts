import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { LoginRequest, LoginResponse, DecodedToken } from '../models/api.model';
import { User } from '../models/user.model';
import { API_ENDPOINTS } from '../constants/constants';
import { 
  STORAGE_KEYS, 
  ROUTES, 
  USER_ROLES, 
  SUCCESS_MESSAGES, 
  INFO_MESSAGES,
  TOAST_SEVERITY,
  TOAST_SUMMARY 
} from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  isLoggedIn = signal<boolean>(false);
  currentUser = signal<User | null>(null);

  constructor() {
    this.restoreSession();
  }

  get userRole(): 'admin' | 'user' | 'superadmin' | 'unauthenticated' {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return USER_ROLES.UNAUTHENTICATED;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.role;
    } catch {
      return USER_ROLES.UNAUTHENTICATED;
    }
  }

  get isAdmin(): boolean {
    return this.userRole === USER_ROLES.ADMIN || this.userRole === USER_ROLES.SUPERADMIN;
  }

  get isUser(): boolean {
    return this.userRole === USER_ROLES.USER;
  }

  get userId(): string | null {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
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
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(res.user));
        this.currentUser.set(res.user);
        this.isLoggedIn.set(true);
        this.messageService.add({
          severity: TOAST_SEVERITY.SUCCESS,
          summary: TOAST_SUMMARY.SUCCESS,
          detail: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        });
        const decoded = jwtDecode<DecodedToken>(res.token);
        if (decoded.role === USER_ROLES.ADMIN || decoded.role === (USER_ROLES.SUPERADMIN as any)) {
          this.router.navigate([ROUTES.ADMIN_DASHBOARD]);
        } else if (decoded.role === USER_ROLES.USER) {
          this.router.navigate([ROUTES.USER_DASHBOARD]);
        }
      })
    );
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.messageService.add({
      severity: TOAST_SEVERITY.INFO,
      summary: TOAST_SUMMARY.INFO,
      detail: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    });
    this.router.navigate([ROUTES.LOGIN]);
  }

  private restoreSession(): void {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 > Date.now()) {
          this.isLoggedIn.set(true);
          if (userStr) {
            this.currentUser.set(JSON.parse(userStr));
          }
        } else {
          this.clearSession();
        }
      } catch {
        this.clearSession();
      }
    }
  }

  private clearSession(): void {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}
