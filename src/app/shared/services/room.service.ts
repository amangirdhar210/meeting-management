import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError,
  of,
  throwError,
} from 'rxjs';
import { Room } from '../models/room.model';
import {
  AddRoomRequest,
  GenericResponse,
  RoomSearchParams,
  DetailedBooking,
  RoomScheduleByDate,
  UpdateRoomRequest,
} from '../models/api.model';
import { MessageService } from 'primeng/api';
import { API_ENDPOINTS } from '../constants';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private rooms = new BehaviorSubject<Room[]>([]);

  rooms$ = this.rooms.asObservable();

  fetchRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(API_ENDPOINTS.ROOMS).pipe(
      tap((rooms: Room[]) => this.rooms.next(rooms ?? [])),
      catchError(() => of([]))
    );
  }

  getRoomById(id: string): Observable<Room> {
    return this.http.get<Room>(`${API_ENDPOINTS.ROOMS}/${id}`);
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
      httpParams = httpParams.set('startTime', params.startTime.toString());
    if (params.endTime)
      httpParams = httpParams.set('endTime', params.endTime.toString());

    return this.http
      .get<Room[]>(`${API_ENDPOINTS.ROOMS}/search`, { params: httpParams })
      .pipe(
        tap((rooms: Room[]) => {
          this.rooms.next(rooms ?? []);
        }),
        catchError((error) => {
          if (error.status === 404) {
            this.rooms.next([]);
            return of([]);
          }
          return of([]);
        })
      );
  }

  getRoomSchedule(roomId: string): Observable<DetailedBooking[]> {
    return this.http
      .get<DetailedBooking[]>(`${API_ENDPOINTS.ROOMS}/${roomId}/schedule`)
      .pipe(catchError(() => of([])));
  }

  getRoomScheduleByDate(
    roomId: string,
    date: string
  ): Observable<RoomScheduleByDate> {
    return this.http.get<RoomScheduleByDate>(
      `${API_ENDPOINTS.ROOMS}/${roomId}/schedule?date=${date}`
    );
  }

  addRoom(newRoom: AddRoomRequest): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(API_ENDPOINTS.ROOMS, newRoom).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Room added successfully',
        });
        this.fetchRooms().subscribe();
      })
    );
  }

  deleteRoom(id: string): Observable<GenericResponse> {
    return this.http
      .delete<GenericResponse>(`${API_ENDPOINTS.ROOMS}/${id}`)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Room deleted successfully',
          });
          this.fetchRooms().subscribe();
        })
      );
  }

  updateRoom(
    id: string,
    updates: UpdateRoomRequest
  ): Observable<GenericResponse> {
    return this.http
      .put<GenericResponse>(`${API_ENDPOINTS.ROOMS}/${id}`, updates)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Room updated successfully',
          });
          this.fetchRooms().subscribe();
        })
      );
  }

  getRooms(): Room[] {
    return this.rooms.getValue();
  }
}
