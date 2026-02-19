import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HeaderComponent } from './header.component';
import { LoginService } from '../../services/login.service';
import { User } from '../../models/user.model';
import { USER_ROLES, DEFAULT_INITIALS, DEFAULT_VALUES } from '../../constants/app.constants';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let loginService: jasmine.SpyObj<LoginService>;

  const mockUser: User = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    created_at: 1707523200,
    updated_at: 1707523200
  };

  const mockAdminUser: User = {
    ...mockUser,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };

  const mockSuperAdminUser: User = {
    ...mockUser,
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'superadmin'
  };

  beforeEach(async () => {
    loginService = jasmine.createSpyObj<LoginService>(
      'LoginService',
      ['logout'],
      {
        currentUser: signal<User | null>(mockUser)
      }
    );

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: LoginService, useValue: loginService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('User Information Display', () => {
    it('should display user name from currentUser signal', () => {
      const userName = component.userName();
      expect(userName).toBe('John Doe');
    });

    it('should display user email from currentUser signal', () => {
      const userEmail = component.userEmail();
      expect(userEmail).toBe('john.doe@example.com');
    });

    it('should display default user name when user is null', () => {
      loginService.currentUser.set(null);
      expect(component.userName()).toBe(DEFAULT_VALUES.USER_DEFAULT);
    });

    it('should display default email when user is null', () => {
      loginService.currentUser.set(null);
      expect(component.userEmail()).toBe(DEFAULT_VALUES.NOT_AVAILABLE);
    });
  });

  describe('User Initials Computation', () => {
    it('should compute initials from first and last name', () => {
      const initials = component.initials();
      expect(initials).toBe('JD');
    });

    it('should compute initials from single name', () => {
      loginService.currentUser.set({
        ...mockUser,
        name: 'Admin'
      });
      expect(component.initials()).toBe('AD');
    });

    it('should return default initials when user is null', () => {
      loginService.currentUser.set(null);
      expect(component.initials()).toBe(DEFAULT_INITIALS);
    });

    it('should handle multiple word names correctly', () => {
      loginService.currentUser.set({
        ...mockUser,
        name: 'John Michael Doe'
      });
      expect(component.initials()).toBe('JD');
    });

    it('should uppercase initials', () => {
      loginService.currentUser.set({
        ...mockUser,
        name: 'jane smith'
      });
      expect(component.initials()).toBe('JS');
    });
  });

  describe('User Role Display', () => {
    it('should display "User" for user role', () => {
      const userRole = component.userRole();
      expect(userRole).toBe(USER_ROLES.USER_DISPLAY);
    });

    it('should display "Administrator" for admin role', () => {
      loginService.currentUser.set(mockAdminUser);
      expect(component.userRole()).toBe(USER_ROLES.ADMINISTRATOR);
    });

    it('should display "Super Administrator" for superadmin role', () => {
      loginService.currentUser.set(mockSuperAdminUser);
      expect(component.userRole()).toBe(USER_ROLES.SUPER_ADMINISTRATOR);
    });

    it('should display "Guest" when user is null', () => {
      loginService.currentUser.set(null);
      expect(component.userRole()).toBe(USER_ROLES.GUEST);
    });
  });

  describe('Logout Functionality', () => {
    it('should call loginService.logout when logout is called', () => {
      component.logout();
      
      expect(loginService.logout).toHaveBeenCalled();
    });

    it('should call logout only once', () => {
      component.logout();
      
      expect(loginService.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Constants', () => {
    it('should have APP_INFO constant defined', () => {
      expect(component.APP_INFO).toBeDefined();
    });

    it('should have UI constant defined', () => {
      expect(component.UI).toBeDefined();
    });

    it('should have BUTTONS constant defined', () => {
      expect(component.BUTTONS).toBeDefined();
    });
  });

  describe('Signal Reactivity', () => {
    it('should update userName when currentUser signal changes', () => {
      const newUser: User = {
        ...mockUser,
        name: 'Jane Smith'
      };
      
      loginService.currentUser.set(newUser);
      fixture.detectChanges();
      
      expect(component.userName()).toBe('Jane Smith');
    });

    it('should update userEmail when currentUser signal changes', () => {
      const newUser: User = {
        ...mockUser,
        email: 'jane.smith@example.com'
      };
      
      loginService.currentUser.set(newUser);
      fixture.detectChanges();
      
      expect(component.userEmail()).toBe('jane.smith@example.com');
    });

    it('should update initials when currentUser signal changes', () => {
      const newUser: User = {
        ...mockUser,
        name: 'Alice Brown'
      };
      
      loginService.currentUser.set(newUser);
      fixture.detectChanges();
      
      expect(component.initials()).toBe('AB');
    });

    it('should update userRole when currentUser signal changes', () => {
      loginService.currentUser.set(mockAdminUser);
      fixture.detectChanges();
      
      expect(component.userRole()).toBe(USER_ROLES.ADMINISTRATOR);
    });
  });
});
