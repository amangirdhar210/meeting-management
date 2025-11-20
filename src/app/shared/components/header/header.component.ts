import { Component, inject, computed, effect } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [OverlayPanelModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private loginService = inject(LoginService);

  user = this.loginService.currentUser;

  initials = computed(() => {
    const name = this.user()?.name;
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  userName = computed(() => this.user()?.name || 'User');
  userEmail = computed(() => this.user()?.email || 'N/A');
  userRole = computed(() => {
    const role = this.user()?.role;
    return role === 'admin'
      ? 'Administrator'
      : role === 'user'
      ? 'User'
      : 'Guest';
  });

  logout(): void {
    this.loginService.logout();
  }
}
