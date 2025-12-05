import { Component, OnInit, inject, signal } from '@angular/core';
import { BookingService } from '../../../shared/services/booking.service';
import { DetailedBooking, Booking } from '../../../shared/models/api.model';
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

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
        this.loading.set(false);
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
}
