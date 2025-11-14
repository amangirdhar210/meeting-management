import { Component, OnInit, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MeetingRoomsComponent } from '../../components/meeting-rooms/meeting-rooms.component';
import { RoomService } from '../../shared/services/room.service';
import { Room } from '../../shared/models/room.model';

@Component({
  selector: 'app-user-dashboard',
  imports: [HeaderComponent, MeetingRoomsComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  private roomService = inject(RoomService);
  rooms = signal<Room[]>([]);

  ngOnInit(): void {
    this.roomService.fetchRooms().subscribe();
    this.roomService.rooms$.subscribe((data: Room[]) => this.rooms.set(data));
  }
}
