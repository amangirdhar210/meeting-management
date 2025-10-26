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
