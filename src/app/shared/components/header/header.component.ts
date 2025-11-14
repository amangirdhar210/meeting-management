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

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private loginService = inject(LoginService);
  private subscription?: Subscription;

  currentUser = signal<'admin' | 'user' | 'unauthenticated'>('unauthenticated');
  user = signal<User | undefined>(undefined);
  initials = computed(() => this.user()?.name?.[0]?.toUpperCase() || '?');

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
