import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
@Component({
  selector: 'app-user-mgmt',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './user-mgmt.component.html',
  styleUrl: './user-mgmt.component.scss',
})
export class UserMgmtComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isAddingRoom = signal<boolean>(false);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.users$.subscribe((data) => (this.users = data));
  }
  ngOnDestroy(): void {
    console.log('ng destroy of user mgmt called');
  }
}
