import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingFormComponent } from './booking-form.component';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Room } from '../../../shared/models/room.model';

describe('BookingFormComponent', () => {
  let component: BookingFormComponent;
  let fixture: ComponentFixture<BookingFormComponent>;
  let mockRoom: Room;

  beforeEach(async () => {
    mockRoom = {
      id: '1',
      name: 'Test Room',
      room_number: 101,
      capacity: 10,
      floor: 1,
      amenities: ['Projector'],
      location: 'Building A',
      description: 'Test Description',
      status: 'available',
    };

    await TestBed.configureTestingModule({
      imports: [BookingFormComponent],
      providers: [
        provideHttpClient(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    component.room = mockRoom;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize booking form', () => {
    expect(component.bookingForm).toBeDefined();
  });

  it('should have VALIDATION constant', () => {
    expect(component.VALIDATION).toBeDefined();
  });

  it('should have cancelBooking output emitter', () => {
    expect(component.cancelBooking).toBeDefined();
  });
});
