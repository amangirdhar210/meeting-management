import { Component, OnInit, signal } from '@angular/core';
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
export class RoomManagementComponent implements OnInit {
  rooms: Room[] = [];
  isAddingRoom = signal<boolean>(false);
  totalRooms = RoomService.length;
  constructor(private roomService: RoomService) {}
  subscription!: Subscription;
  ngOnInit(): void {
    this.subscription = this.roomService.rooms$.subscribe(
      (data) => (this.rooms = data)
    );
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
}
