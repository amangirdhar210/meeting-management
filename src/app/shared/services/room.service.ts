import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Room } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private rooms = new BehaviorSubject<Room[]>([]);
  rooms$ = this.rooms.asObservable();
  private baseUrl = 'http://localhost:8080/api/rooms';

  constructor(private http: HttpClient) {}

  fetchRooms(): Observable<Room[]> {
    return this.http
      .get<Room[]>(this.baseUrl)
      .pipe(tap((rooms) => this.rooms.next(rooms ?? [])));
  }

  addRoom(newRoom: Omit<Room, 'id'>): Observable<any> {
    return this.http.post<Room>(this.baseUrl, newRoom).pipe(
      tap(() => {
        this.fetchRooms().subscribe();
      })
    );
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.fetchRooms().subscribe();
      })
    );
  }
}
