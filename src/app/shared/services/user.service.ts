import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { User } from '../models/user.model';
import { GenericResponse, RegisterUserRequest } from '../models/api.model';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private users = new BehaviorSubject<User[]>([]);
  private apiUrl = 'http://localhost:8080/api';

  users$ = this.users.asObservable();

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      tap((users: User[]) => this.users.next(users)),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'Failed to fetch users',
        });
        throw error;
      })
    );
  }

  addUser(newUser: RegisterUserRequest): Observable<GenericResponse> {
    return this.http
      .post<GenericResponse>(`${this.apiUrl}/register`, newUser)
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
          throw error;
        })
      );
  }

  deleteUser(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${this.apiUrl}/users/${id}`).pipe(
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
        throw error;
      })
    );
  }

  getUsers(): User[] {
    return this.users.getValue();
  }
}
