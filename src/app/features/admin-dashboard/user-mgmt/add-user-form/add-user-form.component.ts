import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { User } from '../../../../shared/models/user.model';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-add-user-form',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-user-form.component.html',
  styleUrl: './add-user-form.component.scss',
})
export class AddUserFormComponent {
  @Output() cancelAdd = new EventEmitter<void>();
  userService = inject(UserService);
  loading = false;
  error: string | null = null;

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

  onAddUser() {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValues = this.addUserForm.getRawValue();

    const newUser: Omit<User, 'id'> & { password: string } = {
      name: `${formValues.firstName} ${formValues.lastName}`,
      role: formValues.role,
      email: formValues.email,
      password: formValues.password,
    };

    this.userService.addUser(newUser).subscribe({
      next: () => {
        this.loading = false;
        this.addUserForm.reset({
          firstName: '',
          lastName: '',
          role: 'user',
          email: '',
          password: '',
        });
        this.cancelAdd.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.error || 'Failed to add user. Please try again.';
      },
    });
  }

  onCancelAdd() {
    this.addUserForm.reset({
      firstName: '',
      lastName: '',
      role: 'user',
      email: '',
      password: '',
    });
    this.cancelAdd.emit();
  }

  onModalClick(event: any) {
    event.stopPropagation();
  }
}
