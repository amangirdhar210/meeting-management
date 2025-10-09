import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { AddUserFormComponent } from './add-user-form/add-user-form.component';
@Component({
  selector: 'app-user-mgmt',
  imports: [CommonModule, AddUserFormComponent],
  standalone: true,
  templateUrl: './user-mgmt.component.html',
  styleUrl: './user-mgmt.component.scss',
})
export class UserMgmtComponent implements OnInit {
  users: User[] = [];
  isAddingUser = signal<boolean>(false);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.users$.subscribe((data) => (this.users = data));
  }

  startAddingUser() {
    this.isAddingUser.set(true);
  }

  stopAddingUser() {
    this.isAddingUser.set(false);
  }

  onDeleteUser(id: number) {
    const cnf = confirm(`Are you sure you want to delete user?`);
    if (cnf) {
      this.userService.deleteUser(id);
    }
  }
}
