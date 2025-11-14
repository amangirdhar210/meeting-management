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
    this.roomService.fetchRooms().subscribe();
    this.roomService.rooms$.subscribe((data: Room[]) => {
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

    if (
      params.minCapacity ||
      params.maxCapacity ||
      params.floor ||
      params.amenities
    ) {
      this.roomService.searchRooms(params).subscribe(() => {
        this.roomService.rooms$.subscribe((data: Room[]) => {
          this.rooms.set(data);
        });
      });
    } else if (params.searchText) {
      this.filterRoomsLocally(params.searchText);
    } else {
      this.rooms.set(this.allRooms);
    }
  }

  filterRoomsLocally(searchText: string): void {
    const searchLower = searchText.toLowerCase();

    const filtered = this.allRooms.filter(
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

    this.rooms.set(filtered);
  }

  toggleMyBookings(): void {
    this.showMyBookings.update((show) => !show);
    if (!this.showMyBookings()) {
      this.loadRooms();
    }
  }
}
