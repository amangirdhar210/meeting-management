import { Component, Input, signal } from '@angular/core';
import { Room } from '../../shared/models/room.model';
import { MeetingRoomComponent } from './meeting-room/meeting-room.component';

@Component({
  selector: 'app-meeting-rooms',
  imports: [MeetingRoomComponent],
  templateUrl: './meeting-rooms.component.html',
  styleUrl: './meeting-rooms.component.scss',
})
export class MeetingRoomsComponent {
  @Input() set roomsList(rooms: Room[]) {
    this.rooms.set(rooms);
  }

  rooms = signal<Room[]>([]);
}
