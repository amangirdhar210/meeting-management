export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: number;
  updated_at: number;
}

export interface Room {
  id: string;
  name: string;
  roomNumber: number;
  capacity: number;
  floor: number;
  amenities: string[];
  status: 'Available' | 'In Use';
  location: string;
  description?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  start_time: number;
  end_time: number;
  purpose: string;
  status?: string;
}

export interface DetailedBooking {
  id: string;
  user_id: string;
  userName: string;
  userEmail: string;
  room_id: string;
  roomName: string;
  roomNumber: number;
  start_time: number;
  end_time: number;
  duration: number;
  purpose: string;
  status: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface AddRoomRequest {
  name: string;
  roomNumber: number;
  capacity: number;
  floor: number;
  amenities: string[];
  status: string;
  location: string;
  description?: string;
}

export interface CreateBookingRequest {
  room_id: string;
  start_time: string;
  end_time: string;
  purpose: string;
  user_id?: string;
}

export interface AvailabilityCheckRequest {
  roomId: string;
  startTime: string;
  endTime: string;
}

export interface AvailabilityCheckResponse {
  available: boolean;
  roomId: string;
  roomName: string;
  requestedStart: number;
  requestedEnd: number;
  conflictingSlots: ConflictingBooking[];
  suggestedSlots: TimeSlot[];
}

export interface ConflictingBooking {
  bookingId: string;
  startTime: number;
  endTime: number;
  purpose: string;
}

export interface TimeSlot {
  startTime: number;
  endTime: number;
  duration: number;
}

export interface RoomSearchParams {
  searchText?: string;
  minCapacity?: number;
  maxCapacity?: number;
  floor?: number;
  amenities?: string;
  startTime?: string;
  endTime?: string;
}

export interface GenericResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export interface RoomScheduleByDate {
  roomId: string;
  roomName: string;
  roomNumber: number;
  date: string;
  bookings: ScheduleBooking[];
}

export interface ScheduleBooking {
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookingId: string;
  userName: string;
  purpose: string;
}
