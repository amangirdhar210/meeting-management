import { Component, OnInit, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MeetingRoomsComponent } from '../../components/meeting-rooms/meeting-rooms.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { RoomSearchComponent } from './room-search/room-search.component';
import { RoomService } from '../../shared/services/room.service';
import { Room } from '../../shared/models/room.model';
import { RoomSearchParams } from '../../shared/models/api.model';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    HeaderComponent,
    MeetingRoomsComponent,
    MyBookingsComponent,
    RoomSearchComponent,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  private roomService = inject(RoomService);
  rooms = signal<Room[]>([]);
  showMyBookings = signal<boolean>(false);

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.fetchRooms().subscribe();
    this.roomService.rooms$.subscribe((data: Room[]) => this.rooms.set(data));
  }

  handleSearch(params: RoomSearchParams): void {
    this.showMyBookings.set(false);
    this.roomService.searchRooms(params).subscribe((rooms: Room[]) => {
      this.rooms.set(rooms);
    });
  }

  toggleMyBookings(): void {
    this.showMyBookings.update((show) => !show);
    if (!this.showMyBookings()) {
      this.loadRooms();
    }
  }
}
