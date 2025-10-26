import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoomService } from '../../../../shared/services/room.service';
import { Room } from '../../../../shared/models/room.model';

@Component({
  selector: 'add-room-form',
  imports: [ReactiveFormsModule, NgIf],
  standalone: true,
  templateUrl: './add-room-form.component.html',
  styleUrl: './add-room-form.component.scss',
})
export class AddRoomFormComponent {
  @Output() cancelAdd = new EventEmitter<void>();
  @Output() roomAdded = new EventEmitter<Omit<Room, 'id'>>();
  roomService = inject(RoomService);

  addRoomForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    roomNumber: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    capacity: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    floor: new FormControl<number>(0, {
      nonNullable: true,
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
    description: new FormControl<string>(''),
  });

  onAddRoom() {
    if (this.addRoomForm.invalid) {
      this.addRoomForm.markAllAsTouched();
      return;
    }

    const formValues = this.addRoomForm.getRawValue();

    const newRoom: Omit<Room, 'id'> = {
      name: formValues.name,
      roomNumber: formValues.roomNumber,
      capacity: formValues.capacity,
      floor: formValues.floor,
      amenities: formValues.amenities.split(',').map((a) => a.trim()),
      status: 'Available',
      location: formValues.location,
      description: formValues.description ?? undefined,
    };

    this.roomAdded.emit(newRoom);
    this.addRoomForm.reset();
    this.cancelAdd.emit();
  }

  onCancelAdd() {
    this.addRoomForm.reset();
    this.cancelAdd.emit();
  }
}
