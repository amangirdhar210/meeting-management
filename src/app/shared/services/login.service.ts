import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
}

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
  isLoggedIn = signal<boolean>(false);

  constructor(
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {
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

  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:8080/api/login', credentials)
      .pipe(
        tap({
          next: (res) => {
            localStorage.setItem('authToken', res.token);
            this.isLoggedIn.set(true);
            const decoded = jwtDecode<DecodedToken>(res.token);
            if (decoded.role === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if (decoded.role === 'user') {
              this.router.navigate(['/user-dashboard']);
            }
          },
          error: (err) => {
            this.logout();
          },
        })
      );
  }

  logout(): void {
    this.isLoggedIn.set(false);
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  private restoreSession() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn.set(true);
    }
  }
}
