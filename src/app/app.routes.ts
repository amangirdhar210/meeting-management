import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './features/user-dashboard/user-dashboard.component';
import { UserMgmtComponent } from './features/admin-dashboard/user-mgmt/user-mgmt.component';
import { RoomManagementComponent } from './features/admin-dashboard/room-mgmt/room-mgmt.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      // {
      //   path: 'user-mgmt',
      //   component: UserMgmtComponent,
      // },
      {
        path: 'room-mgmt',
        component: RoomManagementComponent,
      },
    ],
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [authGuard, roleGuard(['user'])],
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
