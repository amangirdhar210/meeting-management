import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError,
  of,
  throwError,
} from 'rxjs';
import {
  User
} from '../models/user.model';
import { GenericResponse, RegisterUserRequest, UpdateUserRequest } from '../models/api.model';
import { MessageService } from 'primeng/api';
import { API_ENDPOINTS } from '../constants';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private users = new BehaviorSubject<User[]>([]);

  users$ = this.users.asObservable();

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_ENDPOINTS.USERS).pipe(
      tap((users: User[]) => this.users.next(users)),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'Failed to fetch users',
        });
        return of([]);
      })
    );
  }

  addUser(newUser: RegisterUserRequest): Observable<GenericResponse> {
    return this.http
      .post<GenericResponse>(API_ENDPOINTS.REGISTER, newUser)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User added successfully',
          });
          this.fetchUsers().subscribe();
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.error || 'Failed to add user',
          });
          return throwError(() => error);
        })
      );
  }

  deleteUser(id: string): Observable<GenericResponse> {
    return this.http
      .delete<GenericResponse>(`${API_ENDPOINTS.USERS}/${id}`)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User deleted successfully',
          });
          this.fetchUsers().subscribe();
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.error || 'Failed to delete user',
          });
          return throwError(() => error);
        })
      );
  }

  updateUser(id: string, updates: UpdateUserRequest): Observable<GenericResponse> {
    return this.http
      .put<GenericResponse>(`${API_ENDPOINTS.USERS}/${id}`, updates)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully',
          });
          this.fetchUsers().subscribe();
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.error || 'Failed to update user',
          });
          return throwError(() => error);
        })
      );
  }

  getUsers(): User[] {
    return this.users.getValue();
  }
}
