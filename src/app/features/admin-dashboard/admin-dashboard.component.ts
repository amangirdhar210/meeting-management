import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RoomManagementComponent } from './room-mgmt/room-mgmt.component';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { AllBookingsComponent } from './all-bookings/all-bookings.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { StatsCardComponent } from '../../shared/components/stats-card/statsCard.component';
import { RoomService } from '../../shared/services/room.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { Room } from '../../shared/models/room.model';
import { ROOM_STATUS, UI_LABELS, BUTTON_LABELS } from '../../shared/constants/app.constants';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RoomManagementComponent,
    UserMgmtComponent,
    AllBookingsComponent,
    HeaderComponent,
    StatsCardComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private roomService = inject(RoomService);
  private userService = inject(UserService);

  readonly UI = UI_LABELS;
  readonly BUTTONS = BUTTON_LABELS;

  rooms = signal<Room[]>([]);
  users = signal<User[]>([]);
  activeTab = signal<'rooms' | 'users' | 'bookings'>('rooms');

  totalRooms = computed(() => this.rooms().length);
  availableRooms = computed(
    () => this.rooms().filter((r: Room) => r.status === ROOM_STATUS.AVAILABLE).length
  );
  totalUsers = computed(() => this.users().length);

  ngOnInit(): void {
    this.roomService.fetchRooms().subscribe();
    this.userService.fetchUsers().subscribe();

    this.roomService.rooms$.subscribe((rooms: Room[]) => this.rooms.set(rooms));
    this.userService.users$.subscribe((users: User[]) => this.users.set(users));
  }

  switchTab(tab: 'rooms' | 'users' | 'bookings'): void {
    this.activeTab.set(tab);
  }
}
