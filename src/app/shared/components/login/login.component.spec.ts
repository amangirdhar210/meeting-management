import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    expect(component.loginForm.value).toEqual({
      email: '',
      password: '',
    });
  });

  it('should have email and password form controls', () => {
    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it('should mark email as invalid when empty', () => {
    const emailControl = component.loginForm.get('email');
    expect(emailControl?.valid).toBeFalsy();
  });

  it('should mark password as invalid when empty', () => {
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl?.valid).toBeFalsy();
  });
});
