import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';

import { LoginComponent } from './login.component';
import { LoginService } from '../../services/login.service';
import { LoginResponse } from '../../models/api.model';
import { User } from '../../models/user.model';
import { ROUTES, USER_ROLES } from '../../constants/app.constants';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: jasmine.SpyObj<LoginService>;
  let router: jasmine.SpyObj<Router>;

  const mockLoginResponse: LoginResponse = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
    user: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      created_at: 1707523200,
      updated_at: 1707523200
    }
  };

  beforeEach(async () => {
    const isLoggedInSignal = signal(false);
    const currentUserSignal = signal<User | null>(null);
    
    loginService = jasmine.createSpyObj<LoginService>(
      'LoginService',
      ['login', 'logout'],
      {
        userRole: 'unauthenticated'
      }
    );
    
    // Mock isLoggedIn as a function that returns signal value
    (loginService as any).isLoggedIn = jasmine.createSpy('isLoggedIn').and.callFake(() => isLoggedInSignal());
    (loginService as any).currentUser = currentUserSignal;

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: LoginService, useValue: loginService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.invalid).toBeTrue();
  });

  describe('Form Validation', () => {
    it('should mark email as invalid when empty', () => {
      const email = component.email;
      email.setValue('');
      email.markAsTouched();
      
      expect(email.invalid).toBeTrue();
      expect(email.errors?.['required']).toBeTrue();
    });

    it('should mark email as invalid when format is incorrect', () => {
      const email = component.email;
      email.setValue('invalid-email');
      email.markAsTouched();
      
      expect(email.invalid).toBeTrue();
      expect(email.errors?.['email']).toBeTrue();
    });

    it('should mark email as valid with correct format', () => {
      const email = component.email;
      email.setValue('valid@example.com');
      
      expect(email.valid).toBeTrue();
    });

    it('should mark password as invalid when empty', () => {
      const password = component.password;
      password.setValue('');
      password.markAsTouched();
      
      expect(password.invalid).toBeTrue();
      expect(password.errors?.['required']).toBeTrue();
    });

    it('should mark password as invalid when less than 8 characters', () => {
      const password = component.password;
      password.setValue('Pass1!');
      
      expect(password.invalid).toBeTrue();
      expect(password.errors?.['minlength']).toBeTruthy();
    });

    it('should mark password as invalid without uppercase letter', () => {
      const password = component.password;
      password.setValue('password123!');
      
      expect(password.invalid).toBeTrue();
      expect(password.errors?.['pattern']).toBeTruthy();
    });

    it('should mark password as invalid without number', () => {
      const password = component.password;
      password.setValue('Password!');
      
      expect(password.invalid).toBeTrue();
      expect(password.errors?.['pattern']).toBeTruthy();
    });

    it('should mark password as invalid without special character', () => {
      const password = component.password;
      password.setValue('Password123');
      
      expect(password.invalid).toBeTrue();
      expect(password.errors?.['pattern']).toBeTruthy();
    });

    it('should mark password as valid with all requirements met', () => {
      const password = component.password;
      password.setValue('Password123!');
      
      expect(password.valid).toBeTrue();
    });

    it('should mark form as valid when all fields are valid', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!'
      });
      
      expect(component.loginForm.valid).toBeTrue();
    });
  });

  describe('Navigation on Init', () => {
    it('should redirect admin to admin dashboard if already logged in', () => {
      (loginService as any).isLoggedIn.and.returnValue(true);
      Object.defineProperty(loginService, 'userRole', {
        get: jasmine.createSpy('userRole').and.returnValue(USER_ROLES.ADMIN)
      });
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith([ROUTES.ADMIN_DASHBOARD]);
    });

    it('should redirect superadmin to admin dashboard if already logged in', () => {
      (loginService as any).isLoggedIn.and.returnValue(true);
      Object.defineProperty(loginService, 'userRole', {
        get: jasmine.createSpy('userRole').and.returnValue(USER_ROLES.SUPERADMIN)
      });
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith([ROUTES.ADMIN_DASHBOARD]);
    });

    it('should redirect user to user dashboard if already logged in', () => {
      (loginService as any).isLoggedIn.and.returnValue(true);
      Object.defineProperty(loginService, 'userRole', {
        get: jasmine.createSpy('userRole').and.returnValue(USER_ROLES.USER)
      });
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith([ROUTES.USER_DASHBOARD]);
    });

    it('should not redirect if not logged in', () => {
      (loginService as any).isLoggedIn.and.returnValue(false);
      
      component.ngOnInit();
      
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should not submit when form is invalid', () => {
      component.loginForm.patchValue({
        email: 'invalid',
        password: 'short'
      });
      
      component.onSubmit();
      
      expect(loginService.login).not.toHaveBeenCalled();
      expect(component.isSubmitting).toBeFalse();
    });

    it('should not submit when already submitting', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!'
      });
      component.isSubmitting = true;
      
      component.onSubmit();
      
      expect(loginService.login).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      spyOn(component.loginForm, 'markAllAsTouched');
      
      component.onSubmit();
      
      expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should successfully login with valid credentials', () => {
      loginService.login.and.returnValue(of(mockLoginResponse));
      
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!'
      });
      
      component.onSubmit();
      
      expect(loginService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!'
      });
      expect(component.isSubmitting).toBeFalse(); // After observable completes synchronously
    });

    it('should reset form and submitting state after successful login', (done) => {
      loginService.login.and.returnValue(of(mockLoginResponse));
      spyOn(component.loginForm, 'reset');
      
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!'
      });
      
      component.onSubmit();
      
      setTimeout(() => {
        expect(component.isSubmitting).toBeFalse();
        expect(component.loginForm.reset).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should handle login error gracefully', (done) => {
      const errorResponse = {
        error: {
          message: 'Invalid credentials'
        }
      };
      
      loginService.login.and.returnValue(
        throwError(() => errorResponse)
      );
      
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'WrongPassword123!'
      });
      
      component.onSubmit();
      
      setTimeout(() => {
        expect(component.isSubmitting).toBeFalse();
        done();
      }, 100);
    });
  });

  describe('Form Getters', () => {
    it('should return email form control', () => {
      const emailControl = component.email;
      expect(emailControl).toBeTruthy();
      expect(emailControl as any).toBe(component.loginForm.get('email')!);
    });

    it('should return password form control', () => {
      const passwordControl = component.password;
      expect(passwordControl).toBeTruthy();
      expect(passwordControl as any).toBe(component.loginForm.get('password')!);
    });
  });

  describe('Constants', () => {
    it('should have UI labels defined', () => {
      expect(component.UI).toBeDefined();
    });

    it('should have button labels defined', () => {
      expect(component.BUTTONS).toBeDefined();
    });

    it('should have form labels defined', () => {
      expect(component.LABELS).toBeDefined();
    });

    it('should have validation messages defined', () => {
      expect(component.VALIDATION).toBeDefined();
    });
  });
});
