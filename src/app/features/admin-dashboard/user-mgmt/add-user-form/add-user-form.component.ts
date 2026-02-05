import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../shared/services/user.service';
import {
  RegisterUserRequest,
  UpdateUserRequest,
} from '../../../../shared/models/api.model';
import { User } from '../../../../shared/models/user.model';
import { DEFAULT_VALUES } from '../../../../shared/constants/app.constants';

@Component({
  selector: 'app-add-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './add-user-form.component.html',
  styleUrl: './add-user-form.component.scss',
})
export class AddUserFormComponent implements OnInit {
  @Input() user?: User;
  @Output() cancelAdd = new EventEmitter<void>();
  private userService = inject(UserService);
  isSubmitting = false;
  isEditMode = false;

  addUserForm = new FormGroup({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    role: new FormControl<'user' | 'admin'>('user', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(6)],
    }),
  });

  ngOnInit(): void {
    if (this.user) {
      this.isEditMode = true;
      const nameParts = this.user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      this.addUserForm.patchValue({
        firstName,
        lastName,
        email: this.user.email,
        role: this.user.role,
      });

      this.addUserForm.get('password')?.clearValidators();
      this.addUserForm.get('password')?.updateValueAndValidity();
    } else {
      this.addUserForm
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  onAddUser(): void {
    if (this.addUserForm.invalid || this.isSubmitting) {
      this.addUserForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.addUserForm.getRawValue();

    if (this.isEditMode && this.user) {
      const updates: UpdateUserRequest = {
        name: `${formValues.firstName} ${formValues.lastName}`,
        email: formValues.email,
        role: formValues.role,
      };

      this.userService.updateUser(this.user.id, updates).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.cancelAdd.emit();
        },
        error: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      const newUser: RegisterUserRequest = {
        name: `${formValues.firstName} ${formValues.lastName}`,
        role: formValues.role,
        email: formValues.email,
        password: formValues.password,
      };

      this.userService.addUser(newUser).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.addUserForm.reset({ role: DEFAULT_VALUES.USER_ROLE });
          this.cancelAdd.emit();
        },
        error: () => {
          this.isSubmitting = false;
        },
      });
    }
  }

  onCancelAdd(): void {
    this.addUserForm.reset({ role: DEFAULT_VALUES.USER_ROLE });
    this.cancelAdd.emit();
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }
}
