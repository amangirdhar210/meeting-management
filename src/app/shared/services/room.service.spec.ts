import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { RoomService } from './room.service';
import { Room } from '../models/room.model';
import { 
  AddRoomRequest, 
  UpdateRoomRequest, 
  GenericResponse, 
  RoomSearchParams, 
  DetailedBooking, 
  RoomScheduleByDate,
  ScheduleBooking
} from '../models/api.model';
import { API_ENDPOINTS } from '../constants/constants';

describe('RoomService', () => {
  let service: RoomService;
  let httpMock: HttpTestingController;
  let messageService: jasmine.SpyObj<MessageService>;

  const mockRooms: Room[] = [
    {
      id: '1',
      name: 'Conference Room A',
      room_number: 101,
      capacity: 10,
      location: 'Building 1',
      floor: 1,
      amenities: ['Projector', 'Whiteboard'],
      description: 'Large conference room',
      status: 'available'
    },
    {
      id: '2',
      name: 'Meeting Room B',
      room_number: 102,
      capacity: 6,
      location: 'Building 1',
      floor: 2,
      amenities: ['TV', 'WiFi'],
      description: 'Small meeting room',
      status: 'unavailable'
    }
  ];

  const mockDetailedBookings: DetailedBooking[] = [
    {
      id: '1',
      user_id: 'user1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      room_id: 'room1',
      roomName: 'Conference Room A',
      room_number: 101,
      purpose: 'Team Meeting',
      start_time: 1707652800,
      end_time: 1707656400,
      duration: 60,
      status: 'confirmed'
    }
  ];

  const mockScheduleBookings: ScheduleBooking[] = [
    {
      start_time: 1707652800,
      end_time: 1707656400,
      is_booked: true,
      booking_id: '1',
      user_name: 'John Doe',
      purpose: 'Team Meeting'
    }
  ];

  const mockScheduleByDate: RoomScheduleByDate = {
    room_id: '1',
    room_name: 'Conference Room A',
    room_number: 101,
    date: '2024-02-11',
    bookings: mockScheduleBookings
  };

  const mockGenericResponse: GenericResponse = {
    message: 'Success'
  };

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RoomService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(RoomService);
    httpMock = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchRooms', () => {
    it('should fetch and update rooms list', (done) => {
      service.fetchRooms().subscribe((rooms) => {
        expect(rooms).toEqual(mockRooms);
        expect(rooms.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.ROOMS);
      expect(req.request.method).toBe('GET');
      req.flush(mockRooms);
    });

    it('should emit rooms through observable', (done) => {
      service.rooms$.subscribe((rooms) => {
        if (rooms.length > 0) {
          expect(rooms).toEqual(mockRooms);
          done();
        }
      });

      service.fetchRooms().subscribe();

      const req = httpMock.expectOne(API_ENDPOINTS.ROOMS);
      req.flush(mockRooms);
    });

    it('should return empty array on error', (done) => {
      service.fetchRooms().subscribe((rooms) => {
        expect(rooms).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.ROOMS);
      req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
    });

    it('should handle null response gracefully', (done) => {
      service.fetchRooms().subscribe((rooms) => {
        expect(rooms).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.ROOMS);
      req.flush(null);
    });
  });

  describe('getRoomById', () => {
    it('should fetch room by id', (done) => {
      const roomId = '1';

      service.getRoomById(roomId).subscribe((room) => {
        expect(room).toEqual(mockRooms[0]);
        done();
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.ROOMS}/${roomId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRooms[0]);
    });

    it('should handle room not found error', (done) => {
      const roomId = 'invalid-id';

      service.getRoomById(roomId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.ROOMS}/${roomId}`);
      req.flush({ message: 'Room not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('searchRooms', () => {
    it('should search rooms with all parameters', (done) => {
      const searchParams: RoomSearchParams = {
        minCapacity: 5,
        maxCapacity: 15,
        floor: 1,
        amenities: 'Projector,WiFi',
        startTime: 1707652800,
        endTime: 1707656400
      };

      service.searchRooms(searchParams).subscribe((rooms) => {
        expect(rooms).toEqual(mockRooms);
        done();
      });

      const req = httpMock.expectOne((request) => {
        return request.url === `${API_ENDPOINTS.ROOMS}/search` &&
               request.params.get('minCapacity') === '5' &&
               request.params.get('maxCapacity') === '15' &&
               request.params.get('floor') === '1' &&
               request.params.get('amenities') === 'Projector,WiFi' &&
               request.params.get('startTime') === '1707652800' &&
               request.params.get('endTime') === '1707656400';
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockRooms);
    });

    it('should search rooms with partial parameters', (done) => {
      const searchParams: RoomSearchParams = {
        minCapacity: 5
      };

      service.searchRooms(searchParams).subscribe((rooms) => {
        expect(rooms).toEqual(mockRooms);
        done();
      });

      const req = httpMock.expectOne((request) => {
        return request.url === `${API_ENDPOINTS.ROOMS}/search` &&
               request.params.get('minCapacity') === '5';
      });
      req.flush(mockRooms);
    });

    it('should return empty array when no rooms match', (done) => {
      const searchParams: RoomSearchParams = {
        minCapacity: 100
      };

      service.searchRooms(searchParams).subscribe((rooms) => {
        expect(rooms).toEqual([]);
        done();
      });

      const req = httpMock.expectOne((request) => 
        request.url === `${API_ENDPOINTS.ROOMS}/search`
      );
      req.flush({ message: 'No rooms found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle search error gracefully', (done) => {
      const searchParams: RoomSearchParams = {
        minCapacity: 5
      };

      service.searchRooms(searchParams).subscribe((rooms) => {
        expect(rooms).toEqual([]);
        done();
      });

      const req = httpMock.expectOne((request) => 
        request.url === `${API_ENDPOINTS.ROOMS}/search`
      );
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getRoomSchedule', () => {
    it('should fetch room schedule', (done) => {
      const roomId = '1';

      service.getRoomSchedule(roomId).subscribe((bookings) => {
        expect(bookings).toEqual(mockDetailedBookings);
        done();
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.ROOMS}/${roomId}/schedule`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDetailedBookings);
    });

    it('should return empty array on error', (done) => {
      const roomId = 'invalid-id';

      service.getRoomSchedule(roomId).subscribe((bookings) => {
        expect(bookings).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.ROOMS}/${roomId}/schedule`);
      req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getRoomScheduleByDate', () => {
    it('should fetch room schedule by date', (done) => {
      const roomId = '1';
      const date = '2024-02-11';

      service.getRoomScheduleByDate(roomId, date).subscribe((schedule) => {
        expect(schedule).toEqual(mockScheduleByDate);
        done();
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.ROOMS}/${roomId}/schedule?date=${date}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockScheduleByDate);
    });

    it('should handle invalid date error', (done) => {
      const roomId = '1';
      const date = 'invalid-date';

      service.getRoomScheduleByDate(roomId, date).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.ROOMS}/${roomId}/schedule?date=${date}`);
      req.flush({ message: 'Invalid date format' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('addRoom', () => {
    it('should add new room and refresh list', (done) => {
      const newRoom: AddRoomRequest = {
        name: 'New Room',
        room_number: 103,
        capacity: 8,
        location: 'Building 2',
        floor: 1,
        amenities: ['WiFi'],
        description: 'New meeting room',
        status: 'available'
      };

      service.addRoom(newRoom).subscribe((response) => {
        expect(response).toEqual(mockGenericResponse);
        expect(messageService.add).toHaveBeenCalled();
        done();
      });

      const addReq = httpMock.expectOne(API_ENDPOINTS.ROOMS);
      expect(addReq.request.method).toBe('POST');
      expect(addReq.request.body).toEqual(newRoom);
      addReq.flush(mockGenericResponse);

      const fetchReq = httpMock.expectOne(API_ENDPOINTS.ROOMS);
      fetchReq.flush(mockRooms);
    });

    it('should handle duplicate room number error', (done) => {
      const newRoom: AddRoomRequest = {
        name: 'Duplicate Room',
        room_number: 101,
        capacity: 8,
        location: 'Building 1',
        floor: 1,
        amenities: ['WiFi'],
        description: 'Duplicate',
        status: 'available'
      };

      service.addRoom(newRoom).subscribe({
        error: (error) => {
          expect(error.status).toBe(409);
          done();
        }
      });

      const req = httpMock.expectOne(API_ENDPOINTS.ROOMS);
      req.flush({ message: 'Room number already exists' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('deleteRoom', () => {
    it('should delete room and refresh list', (done) => {
      const roomId = '1';

      service.deleteRoom(roomId).subscribe((response) => {
        expect(response).toEqual(mockGenericResponse);
        expect(messageService.add).toHaveBeenCalled();
        done();
      });

      const deleteReq = httpMock.expectOne(`${API_ENDPOINTS.ROOMS}/${roomId}`);
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush(mockGenericResponse);

      const fetchReq = httpMock.expectOne(API_ENDPOINTS.ROOMS);
      fetchReq.flush(mockRooms.filter(r => r.id !== roomId));
    });

    it('should handle room not found error', (done) => {
      const roomId = 'invalid-id';

      service.deleteRoom(roomId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.ROOMS}/${roomId}`);
      req.flush({ message: 'Room not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateRoom', () => {
    it('should update room and refresh list', (done) => {
      const roomId = '1';
      const updates: UpdateRoomRequest = {
        name: 'Updated Room',
        capacity: 12,
        status: 'maintenance'
      };

      service.updateRoom(roomId, updates).subscribe((response) => {
        expect(response).toEqual(mockGenericResponse);
        expect(messageService.add).toHaveBeenCalled();
        done();
      });

      const updateReq = httpMock.expectOne(`${API_ENDPOINTS.ROOMS}/${roomId}`);
      expect(updateReq.request.method).toBe('PUT');
      expect(updateReq.request.body).toEqual(updates);
      updateReq.flush(mockGenericResponse);

      const fetchReq = httpMock.expectOne(API_ENDPOINTS.ROOMS);
      fetchReq.flush(mockRooms);
    });

    it('should handle invalid update data error', (done) => {
      const roomId = '1';
      const updates: UpdateRoomRequest = {
        capacity: -5
      };

      service.updateRoom(roomId, updates).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.ROOMS}/${roomId}`);
      req.flush({ message: 'Invalid capacity' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getRooms', () => {
    it('should return current rooms from BehaviorSubject', () => {
      service.fetchRooms().subscribe();
      const req = httpMock.expectOne(API_ENDPOINTS.ROOMS);
      req.flush(mockRooms);

      const rooms = service.getRooms();
      expect(rooms).toEqual(mockRooms);
    });

    it('should return empty array when no rooms fetched', () => {
      const rooms = service.getRooms();
      expect(rooms).toEqual([]);
    });
  });
});
