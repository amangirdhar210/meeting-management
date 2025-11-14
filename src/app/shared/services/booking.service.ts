import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import {
  Booking,
  CreateBookingRequest,
  GenericResponse,
  AvailabilityCheckRequest,
  AvailabilityCheckResponse,
} from '../models/api.model';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private baseUrl = 'http://localhost:8080/api';

  createBooking(booking: CreateBookingRequest): Observable<GenericResponse> {
    return this.http
      .post<GenericResponse>(`${this.baseUrl}/bookings`, booking)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Booking created successfully',
          });
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.error || 'Failed to create booking',
          });
          throw error;
        })
      );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings`).pipe(
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'Failed to fetch bookings',
        });
        throw error;
      })
    );
  }

  cancelBooking(id: number): Observable<GenericResponse> {
    return this.http
      .delete<GenericResponse>(`${this.baseUrl}/bookings/${id}`)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Booking cancelled successfully',
          });
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.error || 'Failed to cancel booking',
          });
          throw error;
        })
      );
  }

  checkAvailability(
    request: AvailabilityCheckRequest
  ): Observable<AvailabilityCheckResponse> {
    return this.http
      .post<AvailabilityCheckResponse>(
        `${this.baseUrl}/rooms/check-availability`,
        request
      )
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.error || 'Failed to check availability',
          });
          throw error;
        })
      );
  }
}
