import { Component, Input, signal } from '@angular/core';
import { Room } from '../../../shared/models/room.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-meeting-room',
  imports: [NgClass],
  templateUrl: './meeting-room.component.html',
  styleUrl: './meeting-room.component.scss',
})
export class MeetingRoomComponent {
  @Input({ required: true }) roomData!: Room;
  isAvailable = signal<boolean>(true);
}
