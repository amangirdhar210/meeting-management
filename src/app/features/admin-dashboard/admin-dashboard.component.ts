import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomManagementComponent } from './room-mgmt/room-mgmt.component';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
// import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { StatsCardComponent } from '../../shared/components/stats-card/statsCard.component';
import { RoomService } from '../../shared/services/room.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { Room } from '../../shared/models/room.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RoomManagementComponent,
    UserMgmtComponent,
    CommonModule,
    HeaderComponent,
    StatsCardComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private roomService = inject(RoomService);
  private userService = inject(UserService);

  totalRooms = 0;
  availableRooms = 0;
  totalUsers = 0;

  activeTab: 'rooms' | 'users' = 'rooms';

  ngOnInit(): void {
    this.roomService.rooms$.subscribe((rooms: Room[]) => {
      this.totalRooms = rooms.length;
      this.availableRooms = rooms.filter(
        (r) => r.status === 'Available'
      ).length;
    });

    this.userService.users$.subscribe((users: User[]) => {
      this.totalUsers = users.length;
    });
  }

  switchTab(tab: 'rooms' | 'users') {
    this.activeTab = tab;
  }
}
