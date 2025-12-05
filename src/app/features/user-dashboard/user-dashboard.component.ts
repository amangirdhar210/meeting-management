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

    const needsApiCall =
      params.minCapacity || params.maxCapacity || params.floor;

    if (needsApiCall) {
      const apiParams: RoomSearchParams = {};
      if (params.minCapacity) apiParams.minCapacity = params.minCapacity;
      if (params.maxCapacity) apiParams.maxCapacity = params.maxCapacity;
      if (params.floor) apiParams.floor = params.floor;

      this.roomService.searchRooms(apiParams).subscribe((data: Room[]) => {
        this.applyClientSideFilters(data, params);
      });
    } else {
      this.applyClientSideFilters(this.allRooms, params);
    }
  }

  applyClientSideFilters(rooms: Room[], params: RoomSearchParams): void {
    let filtered = [...rooms];

    if (params.searchText) {
      const searchLower = params.searchText.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchLower) ||
          room.location.toLowerCase().includes(searchLower) ||
          room.description?.toLowerCase().includes(searchLower) ||
          room.roomNumber.toString().includes(searchLower) ||
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
