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
import { API_ENDPOINTS } from '../constants/constants';
import { SUCCESS_MESSAGES, TOAST_SEVERITY, TOAST_SUMMARY } from '../constants/app.constants';

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
            severity: TOAST_SEVERITY.SUCCESS,
            summary: TOAST_SUMMARY.SUCCESS,
            detail: SUCCESS_MESSAGES.BOOKING_CREATED,
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
            severity: TOAST_SEVERITY.SUCCESS,
            summary: TOAST_SUMMARY.SUCCESS,
            detail: SUCCESS_MESSAGES.BOOKING_CANCELLED,
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
