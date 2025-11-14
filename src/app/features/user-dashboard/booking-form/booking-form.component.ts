import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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
export class BookingFormComponent {
  @Input({ required: true }) room!: Room;
  @Output() cancelBooking = new EventEmitter<void>();
  private bookingService = inject(BookingService);

  bookingForm = new FormGroup({
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
  });

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
