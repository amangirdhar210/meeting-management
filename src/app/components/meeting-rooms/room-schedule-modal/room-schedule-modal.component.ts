import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../../shared/services/room.service';
import {
  RoomScheduleByDate,
  ScheduleBooking,
} from '../../../shared/models/api.model';

interface TimeSlot {
  hour: number;
  label: string;
  bookings: ScheduleBooking[];
}

@Component({
  selector: 'app-room-schedule-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-schedule-modal.component.html',
  styleUrl: './room-schedule-modal.component.scss',
})
export class RoomScheduleModalComponent implements OnInit {
  @Input({ required: true }) roomId!: number;
  @Input({ required: true }) roomName!: string;
  @Output() closeModal = new EventEmitter<void>();

  private roomService = inject(RoomService);

  schedule = signal<RoomScheduleByDate | null>(null);
  selectedDate = signal<string>(this.getTodayDate());
  timeSlots = signal<TimeSlot[]>([]);
  loading = signal<boolean>(true);

  workDayStart = 0; // 12 AM (Midnight)
  workDayEnd = 24; // 12 AM (Midnight next day)

  ngOnInit(): void {
    this.loadSchedule();
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  loadSchedule(): void {
    this.loading.set(true);
    this.roomService
      .getRoomScheduleByDate(this.roomId, this.selectedDate())
      .subscribe({
        next: (data) => {
          this.schedule.set(data);
          this.generateTimeSlots(data.bookings || []);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.schedule.set(null);
        },
      });
  }

  generateTimeSlots(bookings: ScheduleBooking[]): void {
    const slots: TimeSlot[] = [];
    for (let hour = this.workDayStart; hour < this.workDayEnd; hour++) {
      const hourBookings = bookings.filter((booking) => {
        const startDate = new Date(booking.startTime);
        const endDate = new Date(booking.endTime);
        const slotStart = hour;
        const slotEnd = hour + 1;

        const bookingStart = startDate.getHours() + startDate.getMinutes() / 60;
        const bookingEnd = endDate.getHours() + endDate.getMinutes() / 60;

        return bookingStart < slotEnd && bookingEnd > slotStart;
      });

      slots.push({
        hour,
        label: this.formatHour(hour),
        bookings: hourBookings,
      });
    }
    this.timeSlots.set(slots);
  }

  formatHour(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour =
      hour > 12 ? hour - 12 : hour === 0 ? 12 : hour === 12 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate.set(input.value);
    this.loadSchedule();
  }

  getBookingPosition(booking: ScheduleBooking, slotHour: number): any {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    const bookingStart = start.getHours() + start.getMinutes() / 60;
    const bookingEnd = end.getHours() + end.getMinutes() / 60;

    const slotStart = slotHour;
    const slotEnd = slotHour + 1;

    // Calculate overlap within this hour slot
    const overlapStart = Math.max(bookingStart, slotStart);
    const overlapEnd = Math.min(bookingEnd, slotEnd);

    if (overlapStart >= overlapEnd) {
      return null;
    }

    const top = ((overlapStart - slotStart) * 100).toFixed(2);
    const height = ((overlapEnd - overlapStart) * 100).toFixed(2);

    return {
      top: `${top}%`,
      height: `${height}%`,
      display: bookingStart >= slotStart && bookingStart < slotEnd,
    };
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  getCurrentStatus(): string {
    if (!this.schedule()) return 'Unknown';

    const now = new Date();
    const bookings = this.schedule()?.bookings || [];

    for (const booking of bookings) {
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);

      if (now >= start && now <= end) {
        return 'In Use';
      }
    }

    return 'Available';
  }

  isToday(): boolean {
    return this.selectedDate() === this.getTodayDate();
  }
}
