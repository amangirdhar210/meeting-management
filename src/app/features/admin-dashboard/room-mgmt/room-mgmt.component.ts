import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../../shared/services/room.service';
import { Room } from '../../../shared/models/room.model';
import { AddRoomFormComponent } from './add-room-form/add-room-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room-mgmt',
  standalone: true,
  imports: [CommonModule, AddRoomFormComponent],
  templateUrl: './room-mgmt.component.html',
  styleUrl: './room-mgmt.component.scss',
})
export class RoomManagementComponent implements OnInit, OnDestroy {
  rooms: Room[] = [];
  isAddingRoom = signal<boolean>(false);
  subscription!: Subscription;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.subscription = this.roomService.rooms$.subscribe(
      (data) => (this.rooms = data)
    );
    this.roomService.fetchRooms().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddRoom() {
    this.isAddingRoom.set(true);
  }
  onCancelAdd() {
    this.isAddingRoom.set(false);
  }

  onDeleteRoom(id: number) {
    const confirmed = confirm('Are you sure you want to delete this room?');
    if (confirmed) {
      this.roomService.deleteRoom(id).subscribe();
    }
  }

  onRoomAdded(newRoom: Omit<Room, 'id'>) {
    this.roomService.addRoom(newRoom).subscribe(() => {
      this.isAddingRoom.set(false);
    });
  }
}
