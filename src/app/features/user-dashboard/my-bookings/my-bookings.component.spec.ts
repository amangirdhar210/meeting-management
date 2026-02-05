import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyBookingsComponent } from './my-bookings.component';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('MyBookingsComponent', () => {
  let component: MyBookingsComponent;
  let fixture: ComponentFixture<MyBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBookingsComponent],
      providers: [
        provideHttpClient(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyBookingsComponent);
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
});
