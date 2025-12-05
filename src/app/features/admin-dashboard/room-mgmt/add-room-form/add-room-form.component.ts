import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoomService } from '../../../../shared/services/room.service';
import { AddRoomRequest } from '../../../../shared/models/api.model';

@Component({
  selector: 'add-room-form',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './add-room-form.component.html',
  styleUrl: './add-room-form.component.scss',
})
export class AddRoomFormComponent {
  @Output() cancelAdd = new EventEmitter<void>();
  private roomService = inject(RoomService);
  isSubmitting = false;

  addRoomForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    roomNumber: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    capacity: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    floor: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    amenities: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    location: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', { nonNullable: true }),
  });

  onAddRoom(): void {
    if (this.addRoomForm.invalid || this.isSubmitting) {
      this.addRoomForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.addRoomForm.getRawValue();

    const newRoom: AddRoomRequest = {
      name: formValues.name,
      roomNumber: formValues.roomNumber!,
      capacity: formValues.capacity!,
      floor: formValues.floor!,
      amenities: formValues.amenities.split(',').map((a: string) => a.trim()),
      status: 'Available',
      location: formValues.location,
      description: formValues.description || undefined,
    };

    this.roomService.addRoom(newRoom).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.addRoomForm.reset();
        this.cancelAdd.emit();
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  onCancelAdd(): void {
    this.addRoomForm.reset();
    this.cancelAdd.emit();
  }
}
