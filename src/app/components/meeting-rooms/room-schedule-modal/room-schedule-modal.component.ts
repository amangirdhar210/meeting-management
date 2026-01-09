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
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
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

interface BookingPosition {
  top: string;
  height: string;
  display: boolean;
}

@Component({
  selector: 'app-room-schedule-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerModule],
  templateUrl: './room-schedule-modal.component.html',
  styleUrl: './room-schedule-modal.component.scss',
})
export class RoomScheduleModalComponent implements OnInit {
  @Input({ required: true }) roomId!: string;
  @Input({ required: true }) roomName!: string;
  @Output() closeModal = new EventEmitter<void>();

  private readonly roomService = inject(RoomService);

  readonly schedule = signal<RoomScheduleByDate | null>(null);
  readonly selectedDate = signal<string>(this.getTodayDate());
  readonly timeSlots = signal<TimeSlot[]>([]);
  readonly loading = signal<boolean>(true);
  selectedDateValue: Date | null = new Date();

  readonly workDayStart = 0;
  readonly workDayEnd = 24;

  ngOnInit(): void {
    this.loadSchedule();
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0] as string;
  }

  loadSchedule(): void {
    this.loading.set(true);
    this.roomService
      .getRoomScheduleByDate(this.roomId, this.selectedDate())
      .subscribe({
        next: (data: RoomScheduleByDate) => {
          this.schedule.set(data);
          this.generateTimeSlots(data.bookings ?? []);
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
    const selectedDateObj = new Date(`${this.selectedDate()}T00:00:00`);

    for (let hour = this.workDayStart; hour < this.workDayEnd; hour++) {
      const slotStartTime = this.createSlotTime(selectedDateObj, hour);
      const slotEndTime = this.createSlotTime(selectedDateObj, hour + 1);
      const hourBookings = this.filterBookingsByTimeSlot(
        bookings,
        slotStartTime,
        slotEndTime
      );

      slots.push({
        hour,
        label: this.formatHour(hour),
        bookings: hourBookings,
      });
    }
    this.timeSlots.set(slots);
  }

  private createSlotTime(baseDate: Date, hour: number): Date {
    const slotTime = new Date(baseDate);
    slotTime.setHours(hour, 0, 0, 0);
    return slotTime;
  }

  private filterBookingsByTimeSlot(
    bookings: ScheduleBooking[],
    slotStart: Date,
    slotEnd: Date
  ): ScheduleBooking[] {
    return bookings.filter((booking: ScheduleBooking) => {
      const bookingStart = new Date(booking.start_time * 1000);
      const bookingEnd = new Date(booking.end_time * 1000);
      return bookingStart < slotEnd && bookingEnd > slotStart;
    });
  }

  formatHour(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour =
      hour > 12 ? hour - 12 : hour === 0 ? 12 : hour === 12 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  onDateChange(): void {
    if (this.selectedDateValue) {
      const date = new Date(this.selectedDateValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      this.selectedDate.set(dateString);
      this.loadSchedule();
    }
  }

  getBookingPosition(
    booking: ScheduleBooking,
    slotHour: number
  ): BookingPosition | null {
    const selectedDateObj = new Date(`${this.selectedDate()}T00:00:00`);
    const slotStartTime = this.createSlotTime(selectedDateObj, slotHour);
    const slotEndTime = this.createSlotTime(selectedDateObj, slotHour + 1);

    const bookingStart = new Date(booking.start_time * 1000);
    const bookingEnd = new Date(booking.end_time * 1000);

    if (bookingStart >= slotEndTime || bookingEnd <= slotStartTime) {
      return null;
    }

    const overlapStart =
      bookingStart > slotStartTime ? bookingStart : slotStartTime;
    const overlapEnd = bookingEnd < slotEndTime ? bookingEnd : slotEndTime;

    const slotDurationMs = slotEndTime.getTime() - slotStartTime.getTime();
    const topOffsetMs = overlapStart.getTime() - slotStartTime.getTime();
    const heightMs = overlapEnd.getTime() - overlapStart.getTime();

    const top = ((topOffsetMs / slotDurationMs) * 100).toFixed(2);
    const height = ((heightMs / slotDurationMs) * 100).toFixed(2);

    return {
      top: `${top}%`,
      height: `${height}%`,
      display: true,
    };
  }

  formatTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
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
    const scheduleData = this.schedule();
    if (!scheduleData) {
      return 'Unknown';
    }

    const now = new Date();
    const bookings = scheduleData.bookings ?? [];

    const isInUse = bookings.some((booking: ScheduleBooking) => {
      const start = new Date(booking.start_time * 1000);
      const end = new Date(booking.end_time * 1000);
      return now >= start && now <= end;
    });

    return isInUse ? 'In Use' : 'Available';
  }

  isToday(): boolean {
    return this.selectedDate() === this.getTodayDate();
  }
}
