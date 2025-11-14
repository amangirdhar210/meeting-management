import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
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
export class HeaderComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private loginService = inject(LoginService);
  private subscription?: Subscription;

  currentUser = signal<'admin' | 'user' | 'unauthenticated'>('unauthenticated');
  user = signal<User | undefined>(undefined);

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
    const role = this.currentUser();
    return role === 'admin'
      ? 'Administrator'
      : role === 'user'
      ? 'User'
      : 'Guest';
  });

  ngOnInit(): void {
    this.subscription = this.userService.users$.subscribe((users: User[]) => {
      this.user.set(users && users.length ? users[0] : undefined);
    });

    this.currentUser.set(this.loginService.userRole);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  logout(): void {
    this.loginService.logout();
  }
}
