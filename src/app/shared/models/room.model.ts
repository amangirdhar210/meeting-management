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
