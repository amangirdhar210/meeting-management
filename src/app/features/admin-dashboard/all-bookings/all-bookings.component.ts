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

  cancelBooking(id: number, purpose: string): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to cancel booking: "${purpose}"?`,
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

  isUpcoming(startTime: string): boolean {
    return new Date(startTime) > new Date();
  }

  isPast(endTime: string): boolean {
    return new Date(endTime) < new Date();
  }

  isActive(startTime: string, endTime: string): boolean {
    const now = new Date();
    return new Date(startTime) <= now && new Date(endTime) > now;
  }

  getStatus(startTime: string, endTime: string): string {
    if (this.isPast(endTime)) return 'completed';
    if (this.isActive(startTime, endTime)) return 'active';
    return 'upcoming';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getDuration(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }
}
