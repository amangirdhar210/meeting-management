import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from './login.service';
import { LoginRequest, LoginResponse } from '../models/api.model';
import { API_ENDPOINTS } from '../constants/constants';
import { ROUTES, STORAGE_KEYS, USER_ROLES } from '../constants/app.constants';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let messageService: jasmine.SpyObj<MessageService>;

  const mockLoginResponse: LoginResponse = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwicm9sZSI6InVzZXIiLCJleHAiOjk5OTk5OTk5OTl9.test',
    user: {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      created_at: 1707652800,
      updated_at: 1707652800
    }
  };

  const mockAdminLoginResponse: LoginResponse = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDU2Iiwicm9sZSI6ImFkbWluIiwiZXhwIjo5OTk5OTk5OTk5fQ.test',
    user: {
      id: '456',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      created_at: 1707652800,
      updated_at: 1707652800
    }
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoginService,
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user and navigate to user dashboard', (done) => {
      const credentials: LoginRequest = { email: 'test@example.com', password: 'password' };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
        expect(sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(mockLoginResponse.token);
        expect(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBe(JSON.stringify(mockLoginResponse.user));
        expect(service.isLoggedIn()).toBe(true);
        expect(service.currentUser()).toEqual(mockLoginResponse.user);
        expect(router.navigate).toHaveBeenCalledWith([ROUTES.USER_DASHBOARD]);
        expect(messageService.add).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.LOGIN);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockLoginResponse);
    });

    it('should login admin and navigate to admin dashboard', (done) => {
      const credentials: LoginRequest = { email: 'admin@example.com', password: 'password' };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockAdminLoginResponse);
        expect(router.navigate).toHaveBeenCalledWith([ROUTES.ADMIN_DASHBOARD]);
        done();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.LOGIN);
      req.flush(mockAdminLoginResponse);
    });

    it('should handle login error', (done) => {
      const credentials: LoginRequest = { email: 'test@example.com', password: 'wrong' };

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(API_ENDPOINTS.LOGIN);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear session and navigate to login', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'test-token');
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockLoginResponse.user));
      service.isLoggedIn.set(true);
      service.currentUser.set(mockLoginResponse.user);

      service.logout();

      expect(service.isLoggedIn()).toBe(false);
      expect(service.currentUser()).toBeNull();
      expect(sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
      expect(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith([ROUTES.LOGIN]);
      expect(messageService.add).toHaveBeenCalled();
    });
  });

  describe('userRole', () => {
    it('should return user role from token', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockLoginResponse.token);
      expect(service.userRole).toBe('user');
    });

    it('should return admin role from token', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockAdminLoginResponse.token);
      expect(service.userRole).toBe('admin');
    });

    it('should return unauthenticated when no token', () => {
      expect(service.userRole).toBe(USER_ROLES.UNAUTHENTICATED);
    });

    it('should return unauthenticated for invalid token', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'invalid-token');
      expect(service.userRole).toBe(USER_ROLES.UNAUTHENTICATED);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockAdminLoginResponse.token);
      expect(service.isAdmin).toBe(true);
    });

    it('should return false for user role', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockLoginResponse.token);
      expect(service.isAdmin).toBe(false);
    });
  });

  describe('isUser', () => {
    it('should return true for user role', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockLoginResponse.token);
      expect(service.isUser).toBe(true);
    });

    it('should return false for admin role', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockAdminLoginResponse.token);
      expect(service.isUser).toBe(false);
    });
  });

  describe('userId', () => {
    it('should return user id from token', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockLoginResponse.token);
      expect(service.userId).toBe('123');
    });

    it('should return null when no token', () => {
      expect(service.userId).toBeNull();
    });

    it('should return null for invalid token', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'invalid-token');
      expect(service.userId).toBeNull();
    });
  });

  describe('session restoration', () => {
    it('should restore valid session on initialization', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockLoginResponse.token);
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockLoginResponse.user));

      const newService = new LoginService();
      
      expect(newService.isLoggedIn()).toBe(true);
      expect(newService.currentUser()).toEqual(mockLoginResponse.user);
    });

    it('should clear expired session on initialization', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwicm9sZSI6InVzZXIiLCJleHAiOjF9.test';
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, expiredToken);
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockLoginResponse.user));

      const newService = new LoginService();
      
      expect(newService.isLoggedIn()).toBe(false);
      expect(newService.currentUser()).toBeNull();
      expect(sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
    });

    it('should clear invalid session on initialization', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'invalid-token');
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockLoginResponse.user));

      const newService = new LoginService();
      
      expect(newService.isLoggedIn()).toBe(false);
      expect(newService.currentUser()).toBeNull();
    });
  });
});
