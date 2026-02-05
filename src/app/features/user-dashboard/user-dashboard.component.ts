import { Component, OnInit, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MeetingRoomsComponent } from '../../components/meeting-rooms/meeting-rooms.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { RoomSearchComponent } from './room-search/room-search.component';
import { RoomService } from '../../shared/services/room.service';
import { Room } from '../../shared/models/room.model';
import { RoomSearchParams } from '../../shared/models/api.model';
import { UI_LABELS, BUTTON_LABELS } from '../../shared/constants/app.constants';

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
  
  readonly UI = UI_LABELS;
  readonly BUTTONS = BUTTON_LABELS;
  
  rooms = signal<Room[]>([]);
  showMyBookings = signal<boolean>(false);
  private allRooms: Room[] = [];

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.fetchRooms().subscribe((data: Room[]) => {
      this.allRooms = data;
      this.rooms.set(data);
    });
  }

  handleSearch(params: RoomSearchParams): void {
    this.showMyBookings.set(false);

    if (Object.keys(params).length === 0) {
      this.rooms.set(this.allRooms);
      return;
    }

    this.applyClientSideFilters(this.allRooms, params);
  }

  applyClientSideFilters(rooms: Room[], params: RoomSearchParams): void {
    let filtered = [...rooms];

    if (params.minCapacity !== undefined || params.maxCapacity !== undefined) {
      const min = params.minCapacity ?? 0;
      const max = params.maxCapacity ?? Number.MAX_SAFE_INTEGER;
      filtered = filtered.filter(
        (room) => room.capacity >= min && room.capacity <= max
      );
    }

    if (params.floor !== null && params.floor !== undefined) {
      filtered = filtered.filter((room) => room.floor === params.floor);
    }

    if (params.searchText) {
      const searchLower = params.searchText.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchLower) ||
          room.location.toLowerCase().includes(searchLower) ||
          room.description?.toLowerCase().includes(searchLower) ||
          room.room_number.toString().includes(searchLower) ||
          room.capacity.toString().includes(searchLower) ||
          room.amenities.some((amenity) =>
            amenity.toLowerCase().includes(searchLower)
          )
      );
    }

    if (params.amenities) {
      const requiredAmenities = params.amenities
        .split(',')
        .map((a) => a.trim().toLowerCase())
        .filter((a) => a);

      filtered = filtered.filter((room) =>
        requiredAmenities.every((reqAmenity) =>
          room.amenities.some((roomAmenity) =>
            roomAmenity.toLowerCase().includes(reqAmenity)
          )
        )
      );
    }

    this.rooms.set(filtered);
  }

  toggleMyBookings(): void {
    this.showMyBookings.update((show) => !show);
    if (!this.showMyBookings()) {
      this.loadRooms();
    }
  }
}
