import { Component, Input, signal } from '@angular/core';
import { Room } from '../../../shared/models/room.model';
import { BookingFormComponent } from '../../../features/user-dashboard/booking-form/booking-form.component';
import { RoomScheduleModalComponent } from '../room-schedule-modal/room-schedule-modal.component';

@Component({
  selector: 'app-meeting-room',
  imports: [BookingFormComponent, RoomScheduleModalComponent],
  templateUrl: './meeting-room.component.html',
  styleUrl: './meeting-room.component.scss',
})
export class MeetingRoomComponent {
  @Input({ required: true }) roomData!: Room;
  isBooking = signal<boolean>(false);
  isViewingSchedule = signal<boolean>(false);

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
