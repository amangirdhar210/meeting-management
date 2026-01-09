export interface Room {
  id: string;
  name: string;
  room_number: number;
  capacity: number;
  floor: number;
  amenities: string[];
  status: 'Available' | 'In Use';
  location: string;
  description?: string;
}
