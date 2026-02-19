import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { RegisterUserRequest, UpdateUserRequest, GenericResponse } from '../models/api.model';
import { API_ENDPOINTS } from '../constants/constants';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let messageService: jasmine.SpyObj<MessageService>;

  const mockUsers: User[] = [
    { id: '1', name: 'User One', email: 'user1@example.com', role: 'user', created_at: 1707652800, updated_at: 1707652800 },
    { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin', created_at: 1707652800, updated_at: 1707652800 },
    { id: '3', name: 'User Two', email: 'user2@example.com', role: 'user', created_at: 1707652800, updated_at: 1707652800 }
  ];

  const mockGenericResponse: GenericResponse = {
    message: 'Success'
  };

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchUsers', () => {
    it('should fetch and update users list', (done) => {
      service.fetchUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.USERS);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should emit users through observable', (done) => {
      service.users$.subscribe((users) => {
        if (users.length > 0) {
          expect(users).toEqual(mockUsers);
          done();
        }
      });

      service.fetchUsers().subscribe();

      const req = httpMock.expectOne(API_ENDPOINTS.USERS);
      req.flush(mockUsers);
    });

    it('should return empty array on error', (done) => {
      service.fetchUsers().subscribe((users) => {
        expect(users).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.USERS);
      req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('addUser', () => {
    it('should add new user and refresh list', (done) => {
      const newUser: RegisterUserRequest = {
        name: 'New User',
        email: 'new@example.com',
        role: 'user',
        password: 'Password123!'
      };

      service.addUser(newUser).subscribe((response) => {
        expect(response).toEqual(mockGenericResponse);
        expect(messageService.add).toHaveBeenCalled();
        done();
      });

      const addReq = httpMock.expectOne(API_ENDPOINTS.REGISTER);
      expect(addReq.request.method).toBe('POST');
      expect(addReq.request.body).toEqual(newUser);
      addReq.flush(mockGenericResponse);

      const fetchReq = httpMock.expectOne(API_ENDPOINTS.USERS);
      fetchReq.flush(mockUsers);
    });

    it('should handle add user error', (done) => {
      const newUser: RegisterUserRequest = {
        name: 'New User',
        email: 'existing@example.com',
        role: 'user',
        password: 'Password123!'
      };

      service.addUser(newUser).subscribe({
        error: (error) => {
          expect(error.status).toBe(409);
          done();
        }
      });

      const req = httpMock.expectOne(API_ENDPOINTS.REGISTER);
      req.flush({ message: 'User already exists' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user and refresh list', (done) => {
      const userId = '1';

      service.deleteUser(userId).subscribe((response) => {
        expect(response).toEqual(mockGenericResponse);
        expect(messageService.add).toHaveBeenCalled();
        done();
      });

      const deleteReq = httpMock.expectOne(`${API_ENDPOINTS.USERS}/${userId}`);
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush(mockGenericResponse);

      const fetchReq = httpMock.expectOne(API_ENDPOINTS.USERS);
      fetchReq.flush(mockUsers.filter(u => u.id !== userId));
    });

    it('should handle delete user error', (done) => {
      const userId = 'invalid-id';

      service.deleteUser(userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.USERS}/${userId}`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateUser', () => {
    it('should update user and refresh list', (done) => {
      const userId = '1';
      const updates: UpdateUserRequest = {
        name: 'Updated Name',
        email: 'updated@example.com',
        role: 'admin'
      };

      service.updateUser(userId, updates).subscribe((response) => {
        expect(response).toEqual(mockGenericResponse);
        expect(messageService.add).toHaveBeenCalled();
        done();
      });

      const updateReq = httpMock.expectOne(`${API_ENDPOINTS.USERS}/${userId}`);
      expect(updateReq.request.method).toBe('PUT');
      expect(updateReq.request.body).toEqual(updates);
      updateReq.flush(mockGenericResponse);

      const fetchReq = httpMock.expectOne(API_ENDPOINTS.USERS);
      fetchReq.flush(mockUsers);
    });

    it('should handle update user error', (done) => {
      const userId = '1';
      const updates: UpdateUserRequest = {
        name: 'Updated Name',
        email: 'invalid-email',
        role: 'user'
      };

      service.updateUser(userId, updates).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_ENDPOINTS.USERS}/${userId}`);
      req.flush({ message: 'Invalid email' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getUsers', () => {
    it('should return current users from BehaviorSubject', () => {
      service.fetchUsers().subscribe();
      const req = httpMock.expectOne(API_ENDPOINTS.USERS);
      req.flush(mockUsers);

      const users = service.getUsers();
      expect(users).toEqual(mockUsers);
    });

    it('should return empty array when no users fetched', () => {
      const users = service.getUsers();
      expect(users).toEqual([]);
    });
  });
});
