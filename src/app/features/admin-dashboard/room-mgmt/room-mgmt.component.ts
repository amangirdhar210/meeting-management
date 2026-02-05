import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { RoomService } from '../../../shared/services/room.service';
import { Room } from '../../../shared/models/room.model';
import { AddRoomFormComponent } from './add-room-form/add-room-form.component';
import { Subscription } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { 
  CONFIRMATION_MESSAGES, 
  DIALOG_HEADERS,
  UI_LABELS,
  BUTTON_LABELS,
  TABLE_HEADERS,
  INFO_MESSAGES 
} from '../../../shared/constants/app.constants';

@Component({
  selector: 'app-room-mgmt',
  standalone: true,
  imports: [AddRoomFormComponent, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './room-mgmt.component.html',
  styleUrl: './room-mgmt.component.scss',
})
export class RoomManagementComponent implements OnInit, OnDestroy {
  private roomService = inject(RoomService);
  private confirmationService = inject(ConfirmationService);
  private subscription!: Subscription;

  readonly UI = UI_LABELS;
  readonly BUTTONS = BUTTON_LABELS;
  readonly HEADERS = TABLE_HEADERS;
  readonly INFO = INFO_MESSAGES;

  rooms = signal<Room[]>([]);
  isAddingRoom = signal<boolean>(false);
  editingRoom = signal<Room | undefined>(undefined);

  ngOnInit(): void {
    this.subscription = this.roomService.rooms$.subscribe((data: Room[]) =>
      this.rooms.set(data)
    );
    this.roomService.fetchRooms().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddRoom(): void {
    this.editingRoom.set(undefined);
    this.isAddingRoom.set(true);
  }

  startEditingRoom(room: Room): void {
    this.editingRoom.set(room);
    this.isAddingRoom.set(true);
  }

  onCancelAdd(): void {
    this.isAddingRoom.set(false);
    this.editingRoom.set(undefined);
  }

  onDeleteRoom(id: string, name: string): void {
    this.confirmationService.confirm({
      message: CONFIRMATION_MESSAGES.DELETE_ROOM(name),
      header: DIALOG_HEADERS.DELETE_CONFIRMATION,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roomService.deleteRoom(id).subscribe();
      },
    });
  }
}
