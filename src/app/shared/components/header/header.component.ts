import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentUser!: 'admin' | 'user' | 'unauthenticated';
  public user?: User;
  public initials?: string;

  private subscription?: Subscription;

  constructor(
    private userService: UserService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.subscription = this.userService.users$.subscribe((users) => {
      this.user = users && users.length ? users[0] : undefined;
      this.initials = this.user?.name?.[0]?.toUpperCase();
      console.log(this.initials, 'initials');
    });

    this.currentUser = this.loginService.userRole;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  logout(): void {
    this.loginService.logout();
  }
}
