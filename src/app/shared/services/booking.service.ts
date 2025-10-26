import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Booking {
  id?: number;
  userID?: number;
  roomID: number;
  startTime: string;
  endTime: string;
  purpose: string;
}

export interface GenericResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  createBooking(booking: Booking): Observable<GenericResponse> {
    return this.http
      .post<GenericResponse>(this.baseUrl, booking, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http
      .get<Booking[]>(this.baseUrl, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  cancelBooking(id: number): Observable<GenericResponse> {
    return this.http
      .delete<GenericResponse>(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let message = 'An unknown error occurred';
    if (error.error && error.error.error) {
      message = error.error.error;
    } else if (error.message) {
      message = error.message;
    }
    return throwError(() => new Error(message));
  }
}
