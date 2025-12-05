import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { AddUserFormComponent } from './add-user-form/add-user-form.component';
import { Subscription } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-mgmt',
  imports: [AddUserFormComponent, ConfirmDialogModule],
  standalone: true,
  providers: [ConfirmationService],
  templateUrl: './user-mgmt.component.html',
  styleUrl: './user-mgmt.component.scss',
})
export class UserMgmtComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private sub = new Subscription();

  users = signal<User[]>([]);
  isAddingUser = signal<boolean>(false);

  ngOnInit(): void {
    this.userService.fetchUsers().subscribe();
    this.sub.add(
      this.userService.users$.subscribe((data: User[]) => this.users.set(data))
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  startAddingUser(): void {
    this.isAddingUser.set(true);
  }

  stopAddingUser(): void {
    this.isAddingUser.set(false);
  }

  onDeleteUser(id: string, name: string): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(id).subscribe();
      },
    });
  }
}
