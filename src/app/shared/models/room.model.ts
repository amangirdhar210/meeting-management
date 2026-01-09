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
