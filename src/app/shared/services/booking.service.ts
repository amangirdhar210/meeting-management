import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  Booking,
  CreateBookingRequest,
  GenericResponse,
  AvailabilityCheckRequest,
  AvailabilityCheckResponse,
} from '../models/api.model';
import { MessageService } from 'primeng/api';
import { API_ENDPOINTS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  createBooking(booking: CreateBookingRequest): Observable<GenericResponse> {
    return this.http
      .post<GenericResponse>(API_ENDPOINTS.BOOKINGS, booking)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Booking created successfully',
          });
        })
      );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(API_ENDPOINTS.BOOKINGS);
  }

  cancelBooking(id: string): Observable<GenericResponse> {
    return this.http
      .delete<GenericResponse>(`${API_ENDPOINTS.BOOKINGS}/${id}`)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Booking cancelled successfully',
          });
        })
      );
  }

  checkAvailability(
    request: AvailabilityCheckRequest
  ): Observable<AvailabilityCheckResponse> {
    return this.http.post<AvailabilityCheckResponse>(
      API_ENDPOINTS.CHECK_AVAILABILITY,
      request
    );
  }
}
