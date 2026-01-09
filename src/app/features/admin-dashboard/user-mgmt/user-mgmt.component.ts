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
  editingUser = signal<User | undefined>(undefined);
  searchQuery = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  filteredUsers = signal<User[]>([]);
  paginatedUsers = signal<User[]>([]);
  totalPages = signal<number>(1);

  ngOnInit(): void {
    this.userService.fetchUsers().subscribe();
    this.sub.add(
      this.userService.users$.subscribe((data: User[]) => {
        this.users.set(data);
        this.applyFiltersAndPagination();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  startAddingUser(): void {
    this.editingUser.set(undefined);
    this.isAddingUser.set(true);
  }

  startEditingUser(user: User): void {
    this.editingUser.set(user);
    this.isAddingUser.set(true);
  }

  stopAddingUser(): void {
    this.isAddingUser.set(false);
    this.editingUser.set(undefined);
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

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
    this.applyFiltersAndPagination();
  }

  applyFiltersAndPagination(): void {
    let filtered = this.users();

    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    this.filteredUsers.set(filtered);
    this.totalPages.set(Math.ceil(filtered.length / this.pageSize()));

    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    this.paginatedUsers.set(filtered.slice(start, end));
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.applyFiltersAndPagination();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      }
    }
    return pages;
  }
}
