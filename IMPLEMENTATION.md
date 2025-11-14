# Meeting Room Management - Frontend

Modern Angular 19 application for meeting room booking and management system.

## Features

### Admin Dashboard

- **User Management**: Add, view, and delete users with role assignment
- **Room Management**: Add, view, and delete meeting rooms with full details
- **Statistics**: Real-time stats for total rooms, available rooms, and total users
- **Tab Navigation**: Switch between room and user management views

### User Dashboard

- **Browse Rooms**: View all available meeting rooms with details
- **Book Rooms**: Create bookings with date/time selection
- **Room Details**: View room capacity, amenities, location, and availability

### Authentication

- JWT-based authentication with role-based access control
- Auto-redirect based on user role (admin/user)
- Protected routes with auth and role guards
- Persistent sessions with token expiration handling

## Technology Stack

- **Angular 19**: Latest Angular with standalone components
- **PrimeNG 19**: UI component library with Toast, ConfirmDialog
- **RxJS**: Reactive programming with Observables
- **Signals**: Modern Angular reactivity
- **TypeScript**: Strict mode enabled for type safety

## Modern Angular Practices

### Signals

```typescript
rooms = signal<Room[]>([]);
totalRooms = computed(() => this.rooms().length);
```

### Control Flow Syntax

```html
@if (condition) {
<div>Content</div>
} @for (item of items(); track item.id) {
<div>{{ item.name }}</div>
}
```

### Dependency Injection

```typescript
private roomService = inject(RoomService);
```

### Standalone Components

All components are standalone with explicit imports

## Type Safety

- All services have properly typed return types
- API models match OpenAPI specification
- No `any` types (except minimal necessary cases)
- Strict TypeScript configuration enabled
- Form controls are strongly typed

## Architecture

```
src/app/
├── shared/
│   ├── models/           # TypeScript interfaces
│   ├── services/         # API services with typed methods
│   ├── components/       # Reusable components (Header, Login)
│   └── guards/           # Auth and role guards
├── features/
│   ├── admin-dashboard/  # Admin views
│   │   ├── user-mgmt/
│   │   └── room-mgmt/
│   └── user-dashboard/   # User views
│       └── booking-form/
└── components/
    └── meeting-rooms/    # Room display components
```

## API Integration

All services integrate with the backend API:

- Base URL: `http://localhost:8080/api`
- JWT token stored in localStorage as `authToken`
- Automatic error handling with toast notifications
- HTTP interceptor adds Authorization header

## Running the Application

```bash
npm install
npm start
```

Navigate to `http://localhost:4200`

### Default Credentials

- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

## API Endpoints Used

- `POST /api/login` - Authentication
- `POST /api/register` - User registration (admin)
- `GET /api/users` - List users (admin)
- `DELETE /api/users/:id` - Delete user (admin)
- `GET /api/rooms` - List rooms
- `POST /api/rooms` - Add room (admin)
- `DELETE /api/rooms/:id` - Delete room (admin)
- `GET /api/rooms/search` - Search rooms
- `POST /api/bookings` - Create booking
- `POST /api/rooms/check-availability` - Check availability

## Code Quality

- No comments in code (self-documenting)
- Consistent naming conventions
- Separation of concerns
- Clean component structure
- Proper error handling
- Responsive design
