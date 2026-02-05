import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllBookingsComponent } from './all-bookings.component';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('AllBookingsComponent', () => {
  let component: AllBookingsComponent;
  let fixture: ComponentFixture<AllBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllBookingsComponent],
      providers: [
        provideHttpClient(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AllBookingsComponent);
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

  it('should initialize bookings signal', () => {
    expect(component.bookings()).toBeDefined();
  });

  it('should initialize filteredBookings signal', () => {
    expect(component.filteredBookings()).toBeDefined();
  });
});
