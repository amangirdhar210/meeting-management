import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { BookingFormComponent } from './booking-form.component';
import { BookingService } from '../../../shared/services/booking.service';
import { Room } from '../../../shared/models/room.model';
import { TIME_CONFIG } from '../../../shared/constants/app.constants';

describe('BookingFormComponent', () => {
  let component: BookingFormComponent;
  let fixture: ComponentFixture<BookingFormComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;
  let mockRoom: Room;

  beforeEach(async () => {
    mockRoom = {
      id: 'room-123',
      name: 'Test Room',
      room_number: 101,
      capacity: 10,
      floor: 1,
      amenities: ['Projector', 'Whiteboard'],
      location: 'Building A',
      description: 'Test Description',
      status: 'available',
    };

    bookingService = jasmine.createSpyObj<BookingService>('BookingService', [
      'createBooking'
    ]);

    await TestBed.configureTestingModule({
      imports: [BookingFormComponent],
      providers: [
        provideAnimations(),
        { provide: BookingService, useValue: bookingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    component.room = mockRoom;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with visible=true', () => {
      expect(component.visible).toBeTrue();
    });

    it('should initialize minDate to today', () => {
      const today = new Date();
      expect(component.minDate.toDateString()).toBe(today.toDateString());
    });

    it('should set maxDate to 15 days ahead', () => {
      const expectedMaxDate = new Date();
      expectedMaxDate.setDate(expectedMaxDate.getDate() + TIME_CONFIG.MAX_BOOKING_DAYS_AHEAD);
      expect(component.maxDate.toDateString()).toBe(expectedMaxDate.toDateString());
    });

    it('should set default start and end times on init', () => {
      expect(component.bookingForm.get('startDateTime')?.value).toBeTruthy();
      expect(component.bookingForm.get('endDateTime')?.value).toBeTruthy();
    });

    it('should set default times to next hour', () => {
      const startTime = component.bookingForm.get('startDateTime')?.value as Date;
      expect(startTime.getMinutes()).toBe(0);
      expect(startTime.getSeconds()).toBe(0);
    });

    it('should set end time 1 hour after start time by default', () => {
      const startTime = component.bookingForm.get('startDateTime')?.value as Date;
      const endTime = component.bookingForm.get('endDateTime')?.value as Date;
      const diffHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      expect(diffHours).toBe(TIME_CONFIG.DEFAULT_BOOKING_DURATION_HOURS);
    });
  });

  describe('Form Validation', () => {
    it('should mark startDateTime as invalid when empty', () => {
      component.bookingForm.patchValue({ startDateTime: null });
      const control = component.bookingForm.get('startDateTime');
      expect(control?.invalid).toBeTrue();
    });

    it('should mark endDateTime as invalid when empty', () => {
      component.bookingForm.patchValue({ endDateTime: null });
      const control = component.bookingForm.get('endDateTime');
      expect(control?.invalid).toBeTrue();
    });

    it('should mark purpose as invalid when empty', () => {
      component.bookingForm.patchValue({ purpose: '' });
      const control = component.bookingForm.get('purpose');
      control?.markAsTouched();
      expect(control?.invalid).toBeTrue();
      expect(control?.errors?.['required']).toBeTrue();
    });

    it('should mark purpose as invalid when less than 5 characters', () => {
      component.bookingForm.patchValue({ purpose: 'Test' });
      const control = component.bookingForm.get('purpose');
      expect(control?.invalid).toBeTrue();
      expect(control?.errors?.['minlength']).toBeTruthy();
    });

    it('should mark purpose as invalid when exceeds 500 characters', () => {
      const longText = 'a'.repeat(501);
      component.bookingForm.patchValue({ purpose: longText });
      const control = component.bookingForm.get('purpose');
      expect(control?.invalid).toBeTrue();
      expect(control?.errors?.['maxlength']).toBeTruthy();
    });

    it('should mark purpose as valid with 5-500 characters', () => {
      component.bookingForm.patchValue({ purpose: 'Valid meeting purpose' });
      const control = component.bookingForm.get('purpose');
      expect(control?.valid).toBeTrue();
    });
  });

  describe('Date/Time Validation', () => {
    it('should return pastBooking error when start time is in the past', () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 2);
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      component.bookingForm.patchValue({
        startDateTime: pastDate,
        endDateTime: futureDate
      });

      expect(component.bookingForm.errors?.['pastBooking']).toBeTrue();
      expect(component.getFormError()).toContain('past');
    });

    it('should return endBeforeStart error when end is before start', () => {
      const start = new Date();
      start.setHours(start.getHours() + 2);
      const end = new Date();
      end.setHours(end.getHours() + 1);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end
      });

      expect(component.bookingForm.errors?.['endBeforeStart']).toBeTrue();
    });

    it('should return bookingTooShort error when duration < 15 minutes', () => {
      const start = new Date();
      start.setHours(start.getHours() + 1);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 10);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end
      });

      expect(component.bookingForm.errors?.['bookingTooShort']).toBeTrue();
    });

    it('should return bookingTooLong error when duration > 12 hours', () => {
      const start = new Date();
      start.setHours(start.getHours() + 1);
      const end = new Date(start);
      end.setHours(end.getHours() + 13);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end
      });

      expect(component.bookingForm.errors?.['bookingTooLong']).toBeTrue();
    });

    it('should return tooFarAhead error when booking > 15 days ahead', () => {
      const start = new Date();
      start.setDate(start.getDate() + 16);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end
      });

      expect(component.bookingForm.errors?.['tooFarAhead']).toBeTrue();
    });

    it('should be valid with proper date/time range', () => {
      const start = new Date();
      start.setHours(start.getHours() + 2);
      start.setMinutes(0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 2);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end,
        purpose: 'Valid meeting purpose'
      });

      expect(component.bookingForm.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    it('should not submit when form is invalid', () => {
      component.bookingForm.patchValue({
        startDateTime: null,
        endDateTime: null,
        purpose: ''
      });

      component.onSubmit();

      expect(bookingService.createBooking).not.toHaveBeenCalled();
    });

    it('should not submit when already submitting', () => {
      component.isSubmitting = true;
      const start = new Date();
      start.setHours(start.getHours() + 1);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end,
        purpose: 'Test meeting'
      });

      component.onSubmit();

      expect(bookingService.createBooking).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      spyOn(component.bookingForm, 'markAllAsTouched');

      component.onSubmit();

      expect(component.bookingForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should successfully create booking with valid data', () => {
      bookingService.createBooking.and.returnValue(of({} as any));

      const start = new Date();
      start.setHours(start.getHours() + 1, 0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end,
        purpose: 'Team meeting'
      });

      component.onSubmit();

      expect(bookingService.createBooking).toHaveBeenCalledWith(
        jasmine.objectContaining({
          room_id: 'room-123',
          purpose: 'Team meeting'
        })
      );
      expect(component.isSubmitting).toBeFalse(); // Observable completes synchronously
    });

    it('should convert dates to Unix timestamps', () => {
      bookingService.createBooking.and.returnValue(of({} as any));

      const start = new Date('2026-02-15T10:00:00');
      const end = new Date('2026-02-15T11:00:00');

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end,
        purpose: 'Test meeting'
      });

      component.onSubmit();

      expect(bookingService.createBooking).toHaveBeenCalledWith(
        jasmine.objectContaining({
          start_time: Math.floor(start.getTime() / 1000),
          end_time: Math.floor(end.getTime() / 1000)
        })
      );
    });

    it('should reset form after successful submission', (done) => {
      bookingService.createBooking.and.returnValue(of({} as any));
      spyOn(component.bookingForm, 'reset');
      spyOn(component.cancelBooking, 'emit');

      const start = new Date();
      start.setHours(start.getHours() + 1, 0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end,
        purpose: 'Test meeting'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(component.isSubmitting).toBeFalse();
        expect(component.visible).toBeFalse();
        expect(component.bookingForm.reset).toHaveBeenCalled();
        expect(component.cancelBooking.emit).toHaveBeenCalled();
        done();
      }, TIME_CONFIG.MODAL_CLOSE_DELAY + 50);
    });

    it('should handle booking error gracefully', (done) => {
      bookingService.createBooking.and.returnValue(
        throwError(() => ({ error: { message: 'Room not available' } }))
      );

      const start = new Date();
      start.setHours(start.getHours() + 1, 0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end,
        purpose: 'Test meeting'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(component.isSubmitting).toBeFalse();
        done();
      }, 100);
    });
  });

  describe('Cancel Functionality', () => {
    it('should hide dialog when cancel is called', () => {
      component.onCancel();
      expect(component.visible).toBeFalse();
    });

    it('should reset form when cancel is called', (done) => {
      spyOn(component.bookingForm, 'reset');

      component.onCancel();

      setTimeout(() => {
        expect(component.bookingForm.reset).toHaveBeenCalled();
        done();
      }, TIME_CONFIG.MODAL_CLOSE_DELAY + 50);
    });

    it('should emit cancelBooking event', (done) => {
      spyOn(component.cancelBooking, 'emit');

      component.onCancel();

      setTimeout(() => {
        expect(component.cancelBooking.emit).toHaveBeenCalled();
        done();
      }, TIME_CONFIG.MODAL_CLOSE_DELAY + 50);
    });
  });

  describe('Error Messages', () => {
    it('should return correct error message for pastBooking', () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      component.bookingForm.patchValue({
        startDateTime: pastDate,
        endDateTime: futureDate
      });

      expect(component.getFormError()).toBeTruthy();
    });

    it('should return correct error message for endBeforeStart', () => {
      const start = new Date();
      start.setHours(start.getHours() + 2);
      const end = new Date();
      end.setHours(end.getHours() + 1);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end
      });

      expect(component.getFormError()).toBeTruthy();
    });

    it('should return empty string when no errors', () => {
      const start = new Date();
      start.setHours(start.getHours() + 1, 0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      component.bookingForm.patchValue({
        startDateTime: start,
        endDateTime: end,
        purpose: 'Valid purpose'
      });

      expect(component.getFormError()).toBe('');
    });
  });
});
