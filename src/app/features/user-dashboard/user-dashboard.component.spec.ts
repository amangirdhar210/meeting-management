import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDashboardComponent } from './user-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDashboardComponent],
      providers: [
        provideHttpClient(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have UI constant', () => {
    expect(component.UI).toBeDefined();
  });

  it('should have BUTTONS constant', () => {
    expect(component.BUTTONS).toBeDefined();
  });

  it('should initialize rooms signal', () => {
    expect(component.rooms()).toBeDefined();
  });

  it('should initialize showMyBookings signal', () => {
    expect(component.showMyBookings()).toBeDefined();
  });
});
