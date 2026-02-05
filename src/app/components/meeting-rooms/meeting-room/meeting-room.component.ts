import { Component, Input, signal, computed, inject } from '@angular/core';
import { Room } from '../../../shared/models/room.model';
import { BookingFormComponent } from '../../../features/user-dashboard/booking-form/booking-form.component';
import { RoomScheduleModalComponent } from '../room-schedule-modal/room-schedule-modal.component';
import { BUTTON_LABELS, UI_LABELS } from '../../../shared/constants/app.constants';

@Component({
  selector: 'app-meeting-room',
  imports: [BookingFormComponent, RoomScheduleModalComponent],
  templateUrl: './meeting-room.component.html',
  styleUrl: './meeting-room.component.scss',
})
export class MeetingRoomComponent {
  @Input({ required: true }) roomData!: Room;

  readonly BUTTONS = BUTTON_LABELS;
  readonly UI = UI_LABELS;

  isBooking = signal<boolean>(false);
  isViewingSchedule = signal<boolean>(false);
  currentStatus = computed(() => this.roomData.status);

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
