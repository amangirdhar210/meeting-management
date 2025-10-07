import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Room } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private rooms = new BehaviorSubject<Room[]>([
    {
      id: 1,
      name: 'Training Hall',
      roomNumber: 809,
      capacity: 30,
      floor: 8,
      amenities: ['Projector', 'Whiteboard', 'SmartScreen'],
      status: 'Available',
    },
    {
      id: 2,
      name: 'Video Conference Room',
      roomNumber: 816,
      capacity: 10,
      floor: 8,
      amenities: ['Smart TV', 'Whiteboard', 'Video Conference'],
      status: 'Available',
    },
    {
      id: 3,
      name: 'Meeting Room',
      roomNumber: 817,
      capacity: 8,
      floor: 2,
      amenities: ['Whiteboard', 'Video Conference', 'Whiteboard'],
      status: 'In Use',
    },
  ]);

  rooms$ = this.rooms.asObservable();

  getRooms(): Room[] {
    return this.rooms.getValue();
  }

  addRoom(newRoom: Omit<Room, 'id'>): void {
    const rooms = this.getRooms();
    const nextId = rooms.length ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
    const updatedRooms = [...rooms, { id: nextId, ...newRoom }];
    this.rooms.next(updatedRooms);
  }

  deleteRoom(id: number): void {
    const updatedRooms = this.getRooms().filter((r) => r.id !== id);
    this.rooms.next(updatedRooms);
  }
}
