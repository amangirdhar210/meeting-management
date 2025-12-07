import { Component, OnInit, inject, signal } from '@angular/core';
import { BookingService } from '../../../shared/services/booking.service';
import { Booking } from '../../../shared/models/api.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';

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

  bookings = signal<Booking[]>([]);
  loading = signal<boolean>(true);
  searchQuery = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

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
      message: `Are you sure you want to cancel this booking: "${purpose}"?`,
      header: 'Cancel Booking',
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
      message: `Are you sure you want to delete this booking: "${purpose}"? This action cannot be undone.`,
      header: 'Delete Booking',
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
    if (this.isPast(endTime)) return 'completed';
    if (this.isActive(startTime, endTime)) return 'active';
    return 'upcoming';
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getDuration(startTime: number, endTime: number): number {
    return Math.round((endTime - startTime) / 60);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
    this.applyFiltersAndPagination();
  }

  applyFiltersAndPagination(): void {
    let filtered = this.bookings();

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
