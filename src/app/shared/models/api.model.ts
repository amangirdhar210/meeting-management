export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'superadmin';
  created_at: number;
  updated_at: number;
}

export interface Room {
  id: string;
  name: string;
  room_number: number;
  capacity: number;
  floor: number;
  amenities: string[];
  status: 'available' | 'unavailable' | 'maintenance';
  location: string;
  description?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  user_name: string;
  room_id: string;
  room_number: number;
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
  room_number: number;
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
  role: 'admin' | 'user' | 'superadmin';
}

export interface AddRoomRequest {
  name: string;
  room_number: number;
  capacity: number;
  floor: number;
  amenities: string[];
  status: 'available' | 'unavailable' | 'maintenance';
  location: string;
  description?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'user' | 'superadmin';
}

export interface UpdateRoomRequest {
  name?: string;
  capacity?: number;
  amenities?: string[];
  status?: 'available' | 'unavailable' | 'maintenance';
  location?: string;
  description?: string;
}

export interface CreateBookingRequest {
  room_id: string;
  start_time: number;
  end_time: number;
  purpose: string;
  user_id?: string;
}

export interface AvailabilityCheckRequest {
  roomId: string;
  startTime: number;
  endTime: number;
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
  startTime?: number;
  endTime?: number;
}

export interface GenericResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export interface RoomScheduleByDate {
  room_id: string;
  room_name: string;
  room_number: number;
  date: string;
  bookings: ScheduleBooking[];
}

export interface ScheduleBooking {
  start_time: number;
  end_time: number;
  is_booked: boolean;
  booking_id: string;
  user_name: string;
  purpose: string;
}

export interface DecodedToken {
  user_id: string;
  role: 'admin' | 'user' | 'superadmin';
  exp: number;
  iat: number;
}

export interface TimeSlotDisplay {
  hour: number;
  label: string;
  bookings: ScheduleBooking[];
}

export interface BookingPosition {
  top: string;
  height: string;
  display: boolean;
}
