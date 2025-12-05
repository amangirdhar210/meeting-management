import { Component, OnInit, inject, signal } from '@angular/core';
import { BookingService } from '../../../shared/services/booking.service';
import { RoomService } from '../../../shared/services/room.service';
import { DetailedBooking } from '../../../shared/models/api.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss',
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private roomService = inject(RoomService);
  private confirmationService = inject(ConfirmationService);

  bookings = signal<DetailedBooking[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        const detailedBookings: DetailedBooking[] = bookings.map((booking) => ({
          id: booking.id,
          user_id: booking.user_id,
          userName: '',
          userEmail: '',
          room_id: booking.room_id,
          roomName: '',
          roomNumber: 0,
          start_time: booking.start_time,
          end_time: booking.end_time,
          duration: 0,
          purpose: booking.purpose,
          status: booking.status || 'confirmed',
        }));
        this.bookings.set(detailedBookings);
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
