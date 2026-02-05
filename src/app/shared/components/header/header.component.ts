import { Component, inject, computed, effect } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';
import { 
  APP_INFO, 
  UI_LABELS, 
  BUTTON_LABELS, 
  USER_ROLES, 
  DEFAULT_INITIALS,
  DEFAULT_VALUES 
} from '../../constants/app.constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [OverlayPanelModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private loginService = inject(LoginService);

  readonly APP_INFO = APP_INFO;
  readonly UI = UI_LABELS;
  readonly BUTTONS = BUTTON_LABELS;

  user = this.loginService.currentUser;

  initials = computed(() => {
    const name = this.user()?.name;
    if (!name) return DEFAULT_INITIALS;
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  userName = computed(() => this.user()?.name || DEFAULT_VALUES.USER_DEFAULT);
  userEmail = computed(() => this.user()?.email || DEFAULT_VALUES.NOT_AVAILABLE);
  userRole = computed(() => {
    const role = this.user()?.role;
    return role === USER_ROLES.ADMIN
      ? USER_ROLES.ADMINISTRATOR
      : role === USER_ROLES.USER
      ? USER_ROLES.USER_DISPLAY
      : USER_ROLES.GUEST;
  });

  logout(): void {
    this.loginService.logout();
  }
}
