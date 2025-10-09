import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { MeetingRoomsComponent } from "../../components/meeting-rooms/meeting-rooms.component";

@Component({
  selector: 'app-user-dashboard',
  imports: [HeaderComponent, MeetingRoomsComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {

}
