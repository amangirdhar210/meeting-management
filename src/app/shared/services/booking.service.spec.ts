import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { BookingService } from './booking.service';
import { 
  Booking, 
  CreateBookingRequest, 
  GenericResponse, 
  AvailabilityCheckRequest, 
  AvailabilityCheckResponse 
} from '../models/api.model';
import { API_ENDPOINTS } from '../constants/constants';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;
  let messageService: jasmine.SpyObj<MessageService>;

  const mockBookings: Booking[] = [
    {
      id: '1',
      room_id: 'room1',
      room_number: 101,
      user_id: 'user1',
      user_name: 'John Doe',
      purpose: 'Team Meeting',
      start_time: 1707652800,
      end_time: 1707656400
    },
    {
      id: '2',
      room_id: 'room2',
      room_number: 102,
      user_id: 'user2',
      user_name: 'Jane Smith',
      purpose: 'Client Call',
      start_time: 1707660000,
      end_time: 1707663600
    }
  ];

  const mockGenericResponse: GenericResponse = {
    message: 'Success'
  };

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BookingService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createBooking', () => {
    it('should create a new booking successfully', (done) => {
      const newBooking: CreateBookingRequest = {
        room_id: 'room1',
        purpose: 'New Meeting',
        start_time: 1707670000,
        end_time: 1707673600
      };

      service.createBooking(newBooking).subscribe((response) => {
        expect(response).toEqual(mockGenericResponse);
        expect(messageService.add).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.BOOKINGS);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBooking);
      req.flush(mockGenericResponse);
    });

    it('should handle booking conflict error', (done) => {
      const conflictBooking: CreateBookingRequest = {
        room_id: 'room1',
        purpose: 'Conflicting Meeting',
        start_time: 1707652800,
        end_time: 1707656400
      };

      service.createBooking(conflictBooking).subscribe({
        error: (error) => {
          expect(error.status).toBe(409);
          done();
        }
      });

      const req = httpMock.expectOne(API_ENDPOINTS.BOOKINGS);
      req.flush(
        { message: 'Room already booked for this time' }, 
        { status: 409, statusText: 'Conflict' }
      );
    });

    it('should handle validation error', (done) => {
      const invalidBooking: CreateBookingRequest = {
        room_id: '',
        purpose: '',
        start_time: 0,
        end_time: 0
      };

      service.createBooking(invalidBooking).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(API_ENDPOINTS.BOOKINGS);
      req.flush(
        { message: 'Invalid booking data' }, 
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });

  describe('getAllBookings', () => {
    it('should fetch all bookings', (done) => {
      service.getAllBookings().subscribe((bookings) => {
        expect(bookings).toEqual(mockBookings);
        expect(bookings.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.BOOKINGS);
      expect(req.request.method).toBe('GET');
      req.flush(mockBookings);
    });

    it('should return empty array when no bookings', (done) => {
      service.getAllBookings().subscribe((bookings) => {
        expect(bookings).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.BOOKINGS);
      req.flush([]);
    });

    it('should handle fetch bookings error', (done) => {
      service.getAllBookings().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(API_ENDPOINTS.BOOKINGS);
      req.flush(
        { message: 'Server error' }, 
        { status: 500, statusText: 'Internal Server Error' }
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel booking successfully', (done) => {
      const bookingId = '1';

      service.cancelBooking(bookingId).subscribe((response) => {
        expect(response).toEqual(mockGenericResponse);
        expect(messageService.add).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.BOOKINGS}/${bookingId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockGenericResponse);
    });

    it('should handle booking not found error', (done) => {
      const bookingId = 'invalid-id';

      service.cancelBooking(bookingId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.BOOKINGS}/${bookingId}`);
      req.flush(
        { message: 'Booking not found' }, 
        { status: 404, statusText: 'Not Found' }
      );
    });

    it('should handle permission denied error', (done) => {
      const bookingId = '2';

      service.cancelBooking(bookingId).subscribe({
        error: (error) => {
          expect(error.status).toBe(403);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.BOOKINGS}/${bookingId}`);
      req.flush(
        { message: 'Cannot cancel booking' }, 
        { status: 403, statusText: 'Forbidden' }
      );
    });
  });

  describe('checkAvailability', () => {
    it('should check room availability successfully', (done) => {
      const availabilityRequest: AvailabilityCheckRequest = {
        roomId: 'room1',
        startTime: 1707670000,
        endTime: 1707673600
      };

      const availabilityResponse: AvailabilityCheckResponse = {
        available: true,
        roomId: 'room1',
        roomName: 'Conference Room A',
        requestedStart: 1707670000,
        requestedEnd: 1707673600,
        conflictingSlots: [],
        suggestedSlots: []
      };

      service.checkAvailability(availabilityRequest).subscribe((response) => {
        expect(response).toEqual(availabilityResponse);
        expect(response.available).toBe(true);
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.CHECK_AVAILABILITY);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(availabilityRequest);
      req.flush(availabilityResponse);
    });

    it('should return unavailable when room is booked', (done) => {
      const availabilityRequest: AvailabilityCheckRequest = {
        roomId: 'room1',
        startTime: 1707652800,
        endTime: 1707656400
      };

      const availabilityResponse: AvailabilityCheckResponse = {
        available: false,
        roomId: 'room1',
        roomName: 'Conference Room A',
        requestedStart: 1707652800,
        requestedEnd: 1707656400,
        conflictingSlots: [{ bookingId: '1', startTime: 1707652800, endTime: 1707656400, purpose: 'Existing Meeting' }],
        suggestedSlots: []
      };

      service.checkAvailability(availabilityRequest).subscribe((response) => {
        expect(response).toEqual(availabilityResponse);
        expect(response.available).toBe(false);
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.CHECK_AVAILABILITY);
      req.flush(availabilityResponse);
    });

    it('should handle availability check error', (done) => {
      const availabilityRequest: AvailabilityCheckRequest = {
        roomId: 'invalid-room',
        startTime: 1707670000,
        endTime: 1707673600
      };

      service.checkAvailability(availabilityRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(API_ENDPOINTS.CHECK_AVAILABILITY);
      req.flush(
        { message: 'Room not found' }, 
        { status: 404, statusText: 'Not Found' }
      );
    });
  });
});
