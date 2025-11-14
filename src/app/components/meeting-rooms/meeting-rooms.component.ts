import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RoomService } from '../../shared/services/room.service';
import { Room } from '../../shared/models/room.model';
import { MeetingRoomComponent } from './meeting-room/meeting-room.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meeting-rooms',
  imports: [MeetingRoomComponent],
  templateUrl: './meeting-rooms.component.html',
  styleUrl: './meeting-rooms.component.scss',
})
export class MeetingRoomsComponent implements OnInit, OnDestroy {
  private roomService = inject(RoomService);
  private subscription!: Subscription;

  rooms = signal<Room[]>([]);

  ngOnInit(): void {
    this.roomService.fetchRooms().subscribe();
    this.subscription = this.roomService.rooms$.subscribe((data: Room[]) =>
      this.rooms.set(data)
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
