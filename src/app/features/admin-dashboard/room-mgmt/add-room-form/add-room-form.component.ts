import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoomService } from '../../../../shared/services/room.service';
import {
  AddRoomRequest,
  UpdateRoomRequest,
} from '../../../../shared/models/api.model';
import { Room } from '../../../../shared/models/room.model';

@Component({
  selector: 'add-room-form',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './add-room-form.component.html',
  styleUrl: './add-room-form.component.scss',
})
export class AddRoomFormComponent implements OnInit, OnDestroy {
  @Input() room?: Room;
  @Output() cancelAdd = new EventEmitter<void>();
  private roomService = inject(RoomService);
  isSubmitting = false;
  isEditMode = false;

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';

    if (this.room) {
      this.isEditMode = true;
      this.addRoomForm.patchValue({
        name: this.room.name,
        roomNumber: this.room.room_number,
        capacity: this.room.capacity,
        floor: this.room.floor,
        amenities: this.room.amenities.join(', '),
        location: this.room.location,
        description: this.room.description || '',
        status: this.room.status,
      });

      this.addRoomForm.get('roomNumber')?.disable();
      this.addRoomForm.get('floor')?.disable();
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

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
    status: new FormControl<'available' | 'unavailable' | 'maintenance'>(
      'available',
      {
        nonNullable: true,
        validators: [Validators.required],
      }
    ),
  });

  onAddRoom(): void {
    if (this.addRoomForm.invalid || this.isSubmitting) {
      this.addRoomForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.addRoomForm.getRawValue();

    if (this.isEditMode && this.room) {
      const updates: UpdateRoomRequest = {
        name: formValues.name,
        capacity: formValues.capacity!,
        amenities: formValues.amenities.split(',').map((a: string) => a.trim()),
        status: formValues.status,
        location: formValues.location,
        description: formValues.description || undefined,
      };

      this.roomService.updateRoom(this.room.id, updates).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.cancelAdd.emit();
        },
        error: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      const newRoom: AddRoomRequest = {
        name: formValues.name,
        room_number: formValues.roomNumber!,
        capacity: formValues.capacity!,
        floor: formValues.floor!,
        amenities: formValues.amenities.split(',').map((a: string) => a.trim()),
        status: 'available',
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
  }

  onCancelAdd(): void {
    this.addRoomForm.reset();
    this.cancelAdd.emit();
  }
}
