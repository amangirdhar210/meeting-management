import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoomService } from '../../shared/services/room.service';
import { Room } from '../../shared/models/room.model';
import { MeetingRoomComponent } from './meeting-room/meeting-room.component';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meeting-rooms',
  imports: [MeetingRoomComponent],
  templateUrl: './meeting-rooms.component.html',
  styleUrl: './meeting-rooms.component.scss',
})
export class MeetingRoomsComponent implements OnInit, OnDestroy {
  rooms: Room[] = [];
  private subscription!: Subscription;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.fetchRooms().subscribe();
    this.subscription = this.roomService.rooms$.subscribe(
      (data) => (this.rooms = data)
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
