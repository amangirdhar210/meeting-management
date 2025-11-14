import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../shared/services/user.service';
import { RegisterUserRequest } from '../../../../shared/models/api.model';

@Component({
  selector: 'app-add-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './add-user-form.component.html',
  styleUrl: './add-user-form.component.scss',
})
export class AddUserFormComponent {
  @Output() cancelAdd = new EventEmitter<void>();
  private userService = inject(UserService);

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
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onAddUser(): void {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      return;
    }

    const formValues = this.addUserForm.getRawValue();

    const newUser: RegisterUserRequest = {
      name: `${formValues.firstName} ${formValues.lastName}`,
      role: formValues.role,
      email: formValues.email,
      password: formValues.password,
    };

    this.userService.addUser(newUser).subscribe({
      next: () => {
        this.addUserForm.reset({ role: 'user' });
        this.cancelAdd.emit();
      },
      error: () => {},
    });
  }

  onCancelAdd(): void {
    this.addUserForm.reset({ role: 'user' });
    this.cancelAdd.emit();
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }
}
