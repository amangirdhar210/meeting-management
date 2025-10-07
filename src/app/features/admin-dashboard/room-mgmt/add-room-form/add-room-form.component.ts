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
  roomService = inject(RoomService);
  addRoomForm = new FormGroup({
    number: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
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
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  onAddRoom() {
    if (this.addRoomForm.invalid) {
      this.addRoomForm.markAllAsTouched();
      return;
    }

    const formValues = this.addRoomForm.getRawValue();

    const newRoom: Omit<Room, 'id'> = {
      name: formValues.title,
      roomNumber: formValues.number,
      capacity: formValues.capacity,
      floor: formValues.floor,
      amenities: formValues.amenities.split(' '),
      status: 'Available',
    };

    this.roomService.addRoom(newRoom);
    this.cancelAdd.emit();
    this.addRoomForm.reset();
  }

  onCancelAdd() {
    this.addRoomForm.reset();
    this.cancelAdd.emit();
  }
}
