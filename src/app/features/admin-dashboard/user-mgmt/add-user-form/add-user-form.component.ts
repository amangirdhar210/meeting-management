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
  addUserForm = new FormGroup({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    role: new FormControl<'User' | 'Admin'>('User', {
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

    const formValues = this.addUserForm.getRawValue();

    const newUser: Omit<User, 'id'> = {
      name: `${formValues.firstName} ${formValues.lastName}`,
      role: formValues.role,
      email: formValues.email,
    };

    this.userService.addUser(newUser);

    console.log('User added:', newUser);

    this.addUserForm.reset({
      firstName: '',
      lastName: '',
      role: 'User',
      email: '',
      password: '',
    });
    this.cancelAdd.emit();
  }

  onCancelAdd() {
    this.addUserForm.reset({
      firstName: '',
      lastName: '',
      role: 'User',
      email: '',
      password: '',
    });
    this.cancelAdd.emit();
  }

  ngOnInit() {
    document.addEventListener('click', (event) => {});
  }

  onModalClick(event: any) {
    event.stopPropagation();
  }
}
