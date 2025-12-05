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
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, CommonModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss',
})
export class BookingFormComponent implements OnInit {
  @Input({ required: true }) room!: Room;
  @Output() cancelBooking = new EventEmitter<void>();
  private bookingService = inject(BookingService);

  visible = true;
  isSubmitting = false;

  bookingForm = new FormGroup(
    {
      startDateTime: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      endDateTime: new FormControl<string>('', {
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

    // Format as datetime-local (YYYY-MM-DDTHH:MM)
    const formatDateTime = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    this.bookingForm.patchValue({
      startDateTime: formatDateTime(nextHour),
      endDateTime: formatDateTime(oneHourLater),
    });
  }

  dateTimeValidator(control: AbstractControl): ValidationErrors | null {
    const startDateTime = control.get('startDateTime')?.value;
    const endDateTime = control.get('endDateTime')?.value;

    if (!startDateTime || !endDateTime) {
      return null;
    }

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);
    const now = new Date();

    if (startDate < now) {
      return { pastBooking: true };
    }

    if (endDate <= startDate) {
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
    if (this.bookingForm.invalid || this.isSubmitting) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.bookingForm.getRawValue();
    const startDateTime = new Date(formValues.startDateTime).toISOString();
    const endDateTime = new Date(formValues.endDateTime).toISOString();

    const booking: CreateBookingRequest = {
      room_id: this.room.id,
      start_time: startDateTime,
      end_time: endDateTime,
      purpose: formValues.purpose,
    };

    this.bookingService.createBooking(booking).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.visible = false;
        setTimeout(() => {
          this.bookingForm.reset();
          this.cancelBooking.emit();
        }, 300);
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  onCancel(): void {
    this.visible = false;
    setTimeout(() => {
      this.bookingForm.reset();
      this.cancelBooking.emit();
    }, 300);
  }
}
