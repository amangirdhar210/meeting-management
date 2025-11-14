import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { Room } from '../models/room.model';
import {
  AddRoomRequest,
  GenericResponse,
  RoomSearchParams,
  DetailedBooking,
} from '../models/api.model';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private rooms = new BehaviorSubject<Room[]>([]);
  private baseUrl = 'http://localhost:8080/api/rooms';

  rooms$ = this.rooms.asObservable();

  fetchRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.baseUrl).pipe(
      tap((rooms: Room[]) => this.rooms.next(rooms ?? [])),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'Failed to fetch rooms',
        });
        throw error;
      })
    );
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'Failed to fetch room details',
        });
        throw error;
      })
    );
  }

  searchRooms(params: RoomSearchParams): Observable<Room[]> {
    let httpParams = new HttpParams();
    if (params.minCapacity)
      httpParams = httpParams.set('minCapacity', params.minCapacity.toString());
    if (params.maxCapacity)
      httpParams = httpParams.set('maxCapacity', params.maxCapacity.toString());
    if (params.floor)
      httpParams = httpParams.set('floor', params.floor.toString());
    if (params.amenities)
      httpParams = httpParams.set('amenities', params.amenities);
    if (params.startTime)
      httpParams = httpParams.set('startTime', params.startTime);
    if (params.endTime) httpParams = httpParams.set('endTime', params.endTime);

    return this.http
      .get<Room[]>(`${this.baseUrl}/search`, { params: httpParams })
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.error || 'Failed to search rooms',
          });
          throw error;
        })
      );
  }

  getRoomSchedule(roomId: number): Observable<DetailedBooking[]> {
    return this.http
      .get<DetailedBooking[]>(`${this.baseUrl}/${roomId}/schedule`)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.error || 'Failed to fetch room schedule',
          });
          throw error;
        })
      );
  }

  addRoom(newRoom: AddRoomRequest): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.baseUrl, newRoom).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Room added successfully',
        });
        this.fetchRooms().subscribe();
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'Failed to add room',
        });
        throw error;
      })
    );
  }

  deleteRoom(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Room deleted successfully',
        });
        this.fetchRooms().subscribe();
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'Failed to delete room',
        });
        throw error;
      })
    );
  }

  getRooms(): Room[] {
    return this.rooms.getValue();
  }
}
