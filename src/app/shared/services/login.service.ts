import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  isLoggedIn = signal<boolean>(false);
  userRole = signal<'user' | 'admin' | 'unauthenticated'>('unauthenticated');

  isAdmin = computed(() => this.userRole() === 'admin');
  isUser = computed(() => this.userRole() === 'user');

  constructor(private router: Router) {
    this.restoreSession();
  }

  login(credentials: { email: string; password: string }): boolean {
    if (
      credentials.email === 'aman@wg.com' &&
      credentials.password === '1234567'
    ) {
      alert('Logged in as Admin');
      this.setSession('admin');
      this.router.navigate(['/admin-dashboard']);
      return true;
    } else if (
      credentials.email === 'user@wg.com' &&
      credentials.password === 'password'
    ) {
      alert('Logged in as User');
      this.setSession('user');
      this.router.navigate(['/user-dashboard']);
      return true;
    } else {
      alert('Invalid credentials');
      return false;
    }
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.userRole.set('unauthenticated');
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  private setSession(role: 'admin' | 'user') {
    this.isLoggedIn.set(true);
    this.userRole.set(role);
    localStorage.setItem('loginStatus', 'true');
    localStorage.setItem('userRole', role);
  }
  private restoreSession() {
    const storedLogin = localStorage.getItem('loginStatus');
    const storedRole =
      (localStorage.getItem('userRole') as 'admin' | 'user' | null) ??
      'unauthenticated';

    if (storedLogin === 'true' && storedRole !== 'unauthenticated') {
      this.isLoggedIn.set(true);
      this.userRole.set(storedRole);
    }
  }
}
