import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public currentUser!: 'admin' | 'user' | 'unauthenticated';
  constructor(
    private userService: UserService,
    private loginService: LoginService
  ) {}
  user?: User;

  ngOnInit(): void {
    this.userService.users$.subscribe((users) => {
      this.user = users && users.length ? users[0] : undefined;
    });
    this.currentUser = this.loginService.userRole;
  }

  logout() {
    this.loginService.logout();
  }
}
