import { Component, OnDestroy, OnInit, signal, inject, computed } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { LoginService } from '../../../shared/services/login.service';
import { AddUserFormComponent } from './add-user-form/add-user-form.component';
import { Subscription } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { 
  CONFIRMATION_MESSAGES, 
  DIALOG_HEADERS, 
  PAGINATION,
  UI_LABELS,
  BUTTON_LABELS,
  TABLE_HEADERS,
  PLACEHOLDERS,
  INFO_MESSAGES,
  NO_DATA_MESSAGES 
} from '../../../shared/constants/app.constants';

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
  private loginService = inject(LoginService);
  private confirmationService = inject(ConfirmationService);
  private sub = new Subscription();

  readonly UI = UI_LABELS;
  readonly BUTTONS = BUTTON_LABELS;
  readonly HEADERS = TABLE_HEADERS;
  readonly PLACEHOLDERS = PLACEHOLDERS;
  readonly INFO = INFO_MESSAGES;
  readonly NO_DATA = NO_DATA_MESSAGES;

  // Role-based access control
  isSuperAdmin = computed(() => this.loginService.userRole === 'superadmin');
  isAdmin = computed(() => this.loginService.userRole === 'admin');
  currentUserRole = computed(() => this.loginService.userRole);

  users = signal<User[]>([]);
  isAddingUser = signal<boolean>(false);
  editingUser = signal<User | undefined>(undefined);
  searchQuery = signal<string>('');
  roleFilter = signal<string>('all');
  currentPage = signal<number>(PAGINATION.DEFAULT_CURRENT_PAGE);
  pageSize = signal<number>(PAGINATION.DEFAULT_PAGE_SIZE);

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
    if (!this.canEditUser(user)) return;
    this.editingUser.set(user);
    this.isAddingUser.set(true);
  }

  canEditUser(user: User): boolean {
    // Superadmins cannot be modified by anyone
    if (user.role === 'superadmin') return false;
    // Admins cannot modify other admin accounts
    if (this.isAdmin() && user.role === 'admin') return false;
    return true;
  }

  canDeleteUser(user: User): boolean {
    // Superadmins cannot be deleted
    if (user.role === 'superadmin') return false;
    // Admins can only delete regular users
    if (this.isAdmin() && user.role !== 'user') return false;
    return true;
  }

  stopAddingUser(): void {
    this.isAddingUser.set(false);
    this.editingUser.set(undefined);
  }

  onDeleteUser(id: string, name: string, user: User): void {
    if (!this.canDeleteUser(user)) return;
    this.confirmationService.confirm({
      message: CONFIRMATION_MESSAGES.DELETE_USER(name),
      header: DIALOG_HEADERS.DELETE_CONFIRMATION,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(id).subscribe();
      },
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(PAGINATION.DEFAULT_CURRENT_PAGE);
    this.applyFiltersAndPagination();
  }

  onRoleFilterChange(role: string): void {
    this.roleFilter.set(role);
    this.currentPage.set(PAGINATION.DEFAULT_CURRENT_PAGE);
    this.applyFiltersAndPagination();
  }

  applyFiltersAndPagination(): void {
    let filtered = this.users();

    if (this.roleFilter() !== 'all') {
      filtered = filtered.filter(user => user.role === this.roleFilter());
    }

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

    if (total <= PAGINATION.MAX_PAGE_BUTTONS) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= PAGINATION.PAGE_RANGE_START) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - PAGINATION.PAGE_RANGE_END) {
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
