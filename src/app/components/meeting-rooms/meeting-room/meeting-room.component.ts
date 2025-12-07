import {
  Component,
  Input,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Room } from '../../../shared/models/room.model';
import { BookingFormComponent } from '../../../features/user-dashboard/booking-form/booking-form.component';
import { RoomScheduleModalComponent } from '../room-schedule-modal/room-schedule-modal.component';
import { RoomService } from '../../../shared/services/room.service';
import { RoomScheduleByDate } from '../../../shared/models/api.model';

@Component({
  selector: 'app-meeting-room',
  imports: [BookingFormComponent, RoomScheduleModalComponent],
  templateUrl: './meeting-room.component.html',
  styleUrl: './meeting-room.component.scss',
})
export class MeetingRoomComponent implements OnInit {
  @Input({ required: true }) roomData!: Room;
  private roomService = inject(RoomService);

  isBooking = signal<boolean>(false);
  isViewingSchedule = signal<boolean>(false);
  currentStatus = signal<string>('Available');

  ngOnInit(): void {
    this.updateRoomStatus();
  }

  private updateRoomStatus(): void {
    const today = new Date().toISOString().split('T')[0];
    this.roomService.getRoomScheduleByDate(this.roomData.id, today).subscribe({
      next: (schedule: RoomScheduleByDate) => {
        this.currentStatus.set(this.calculateStatus(schedule));
      },
      error: () => {
        this.currentStatus.set(this.roomData.status);
      },
    });
  }

  private calculateStatus(schedule: RoomScheduleByDate): string {
    const now = new Date();
    const bookings = schedule.bookings ?? [];

    const isInUse = bookings.some((booking) => {
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);
      return now >= start && now <= end;
    });

    return isInUse ? 'In Use' : 'Available';
  }

  startBooking(): void {
    this.isBooking.set(true);
  }

  cancelBooking(): void {
    this.isBooking.set(false);
  }

  viewSchedule(): void {
    this.isViewingSchedule.set(true);
  }

  closeSchedule(): void {
    this.isViewingSchedule.set(false);
  }
}
