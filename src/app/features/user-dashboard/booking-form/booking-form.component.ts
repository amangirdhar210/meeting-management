import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { BookingService } from '../../../shared/services/booking.service';
import { CreateBookingRequest } from '../../../shared/models/api.model';
import { Room } from '../../../shared/models/room.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss',
})
export class BookingFormComponent implements OnInit {
  @Input({ required: true }) room!: Room;
  @Output() cancelBooking = new EventEmitter<void>();
  private bookingService = inject(BookingService);

  minDate: string = '';
  minTime: string = '';

  bookingForm = new FormGroup(
    {
      startDate: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      startTime: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      endDate: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      endTime: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      purpose: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5)],
      }),
    },
    { validators: [this.dateTimeValidator] }
  );

  ngOnInit(): void {
    this.setDefaultDateTime();
  }

  setDefaultDateTime(): void {
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    nextHour.setMinutes(0, 0, 0);

    const oneHourLater = new Date(nextHour.getTime() + 60 * 60 * 1000);

    this.minDate = this.formatDate(now);
    this.minTime = this.formatTime(now);

    this.bookingForm.patchValue({
      startDate: this.formatDate(nextHour),
      startTime: this.formatTime(nextHour),
      endDate: this.formatDate(oneHourLater),
      endTime: this.formatTime(oneHourLater),
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  dateTimeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const startTime = control.get('startTime')?.value;
    const endDate = control.get('endDate')?.value;
    const endTime = control.get('endTime')?.value;

    if (!startDate || !startTime || !endDate || !endTime) {
      return null;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const now = new Date();

    if (start < now) {
      return { pastBooking: true };
    }

    if (end <= start) {
      return { endBeforeStart: true };
    }

    return null;
  }

  getFormError(): string {
    const errors = this.bookingForm.errors;
    if (errors?.['pastBooking']) {
      return 'Cannot book a room in the past';
    }
    if (errors?.['endBeforeStart']) {
      return 'End time must be after start time';
    }
    return '';
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const formValues = this.bookingForm.getRawValue();
    const startDateTime = `${formValues.startDate}T${formValues.startTime}:00Z`;
    const endDateTime = `${formValues.endDate}T${formValues.endTime}:00Z`;

    const booking: CreateBookingRequest = {
      room_id: this.room.id,
      start_time: startDateTime,
      end_time: endDateTime,
      purpose: formValues.purpose,
    };

    this.bookingService.createBooking(booking).subscribe({
      next: () => {
        this.bookingForm.reset();
        this.cancelBooking.emit();
      },
      error: () => {},
    });
  }

  onCancel(): void {
    this.bookingForm.reset();
    this.cancelBooking.emit();
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }
}
