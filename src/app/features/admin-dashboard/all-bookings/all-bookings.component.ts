import { Component, OnInit, inject, signal } from '@angular/core';
import { BookingService } from '../../../shared/services/booking.service';
import { Booking } from '../../../shared/models/api.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { 
  CONFIRMATION_MESSAGES, 
  DIALOG_HEADERS, 
  DATE_TIME_FORMATS, 
  PAGINATION, 
  BOOKING_STATUS,
  UI_LABELS,
  BUTTON_LABELS,
  INFO_MESSAGES,
  NO_DATA_MESSAGES
} from '../../../shared/constants/app.constants';

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [ConfirmDialogModule, CommonModule],
  providers: [ConfirmationService],
  templateUrl: './all-bookings.component.html',
  styleUrl: './all-bookings.component.scss',
})
export class AllBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private confirmationService = inject(ConfirmationService);

  readonly UI = UI_LABELS;
  readonly BUTTONS = BUTTON_LABELS;
  readonly STATUS = BOOKING_STATUS;
  readonly INFO = INFO_MESSAGES;
  readonly NO_DATA = NO_DATA_MESSAGES;

  bookings = signal<Booking[]>([]);
  loading = signal<boolean>(true);
  searchQuery = signal<string>('');
  statusFilter = signal<string>('all');
  currentPage = signal<number>(PAGINATION.DEFAULT_CURRENT_PAGE);
  pageSize = signal<number>(PAGINATION.DEFAULT_PAGE_SIZE);

  filteredBookings = signal<Booking[]>([]);
  paginatedBookings = signal<Booking[]>([]);
  totalPages = signal<number>(1);

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
        this.loading.set(false);
        this.applyFiltersAndPagination();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  cancelBooking(id: string, purpose: string): void {
    this.confirmationService.confirm({
      message: CONFIRMATION_MESSAGES.CANCEL_BOOKING(purpose),
      header: DIALOG_HEADERS.CANCEL_BOOKING,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bookingService.cancelBooking(id).subscribe({
          next: () => {
            this.loadBookings();
          },
          error: () => {},
        });
      },
    });
  }

  deleteBooking(id: string, purpose: string): void {
    this.confirmationService.confirm({
      message: CONFIRMATION_MESSAGES.DELETE_BOOKING(purpose),
      header: DIALOG_HEADERS.DELETE_BOOKING,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.bookingService.cancelBooking(id).subscribe({
          next: () => {
            this.loadBookings();
          },
          error: () => {},
        });
      },
    });
  }

  isUpcoming(startTime: number): boolean {
    return startTime * 1000 > Date.now();
  }

  isPast(endTime: number): boolean {
    return endTime * 1000 < Date.now();
  }

  isActive(startTime: number, endTime: number): boolean {
    const now = Date.now();
    return startTime * 1000 <= now && endTime * 1000 > now;
  }

  getStatus(startTime: number, endTime: number): string {
    if (this.isPast(endTime)) return BOOKING_STATUS.COMPLETED;
    if (this.isActive(startTime, endTime)) return BOOKING_STATUS.ACTIVE;
    return BOOKING_STATUS.UPCOMING;
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString(
      DATE_TIME_FORMATS.LOCALE,
      DATE_TIME_FORMATS.SHORT_DATE_TIME
    );
  }

  getDuration(startTime: number, endTime: number): number {
    return Math.round((endTime - startTime) / 60);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(PAGINATION.DEFAULT_CURRENT_PAGE);
    this.applyFiltersAndPagination();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter.set(status);
    this.currentPage.set(PAGINATION.DEFAULT_CURRENT_PAGE);
    this.applyFiltersAndPagination();
  }

  applyFiltersAndPagination(): void {
    let filtered = this.bookings();

    if (this.statusFilter() !== 'all') {
      filtered = filtered.filter(booking => {
        const bookingStatus = this.getStatus(booking.start_time, booking.end_time);
        return bookingStatus.toLowerCase() === this.statusFilter();
      });
    }

    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (booking) =>
          booking.user_name.toLowerCase().includes(query) ||
          booking.room_number.toString().includes(query)
      );
    }

    this.filteredBookings.set(filtered);
    this.totalPages.set(Math.ceil(filtered.length / this.pageSize()));

    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    this.paginatedBookings.set(filtered.slice(start, end));
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
