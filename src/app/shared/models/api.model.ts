export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Room {
  id: number;
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
  id: number;
  user_id: number;
  room_id: number;
  start_time: string;
  end_time: string;
  purpose: string;
  status?: string;
}

export interface DetailedBooking {
  id: number;
  user_id: number;
  userName: string;
  userEmail: string;
  room_id: number;
  roomName: string;
  roomNumber: number;
  start_time: string;
  end_time: string;
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
  room_id: number;
  start_time: string;
  end_time: string;
  purpose: string;
}

export interface AvailabilityCheckRequest {
  roomId: number;
  startTime: string;
  endTime: string;
}

export interface AvailabilityCheckResponse {
  available: boolean;
  roomId: number;
  roomName: string;
  requestedStart: string;
  requestedEnd: string;
  conflictingSlots: ConflictingBooking[];
  suggestedSlots: TimeSlot[];
}

export interface ConflictingBooking {
  bookingId: number;
  startTime: string;
  endTime: string;
  purpose: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
}

export interface RoomSearchParams {
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
