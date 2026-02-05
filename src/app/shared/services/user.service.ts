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
import { User } from '../models/user.model';
import {
  GenericResponse,
  RegisterUserRequest,
  UpdateUserRequest,
} from '../models/api.model';
import { MessageService } from 'primeng/api';
import { API_ENDPOINTS } from '../constants/constants';
import { SUCCESS_MESSAGES, TOAST_SEVERITY, TOAST_SUMMARY } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private users = new BehaviorSubject<User[]>([]);

  users$ = this.users.asObservable();

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_ENDPOINTS.USERS).pipe(
      tap((users: User[]) => this.users.next(users)),
      catchError(() => of([]))
    );
  }

  addUser(newUser: RegisterUserRequest): Observable<GenericResponse> {
    return this.http
      .post<GenericResponse>(API_ENDPOINTS.REGISTER, newUser)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: TOAST_SEVERITY.SUCCESS,
            summary: TOAST_SUMMARY.SUCCESS,
            detail: SUCCESS_MESSAGES.USER_ADDED,
          });
          this.fetchUsers().subscribe();
        })
      );
  }

  deleteUser(id: string): Observable<GenericResponse> {
    return this.http
      .delete<GenericResponse>(`${API_ENDPOINTS.USERS}/${id}`)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: TOAST_SEVERITY.SUCCESS,
            summary: TOAST_SUMMARY.SUCCESS,
            detail: SUCCESS_MESSAGES.USER_DELETED,
          });
          this.fetchUsers().subscribe();
        })
      );
  }

  updateUser(
    id: string,
    updates: UpdateUserRequest
  ): Observable<GenericResponse> {
    return this.http
      .put<GenericResponse>(`${API_ENDPOINTS.USERS}/${id}`, updates)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: TOAST_SEVERITY.SUCCESS,
            summary: TOAST_SUMMARY.SUCCESS,
            detail: SUCCESS_MESSAGES.USER_UPDATED,
          });
          this.fetchUsers().subscribe();
        })
      );
  }

  getUsers(): User[] {
    return this.users.getValue();
  }
}
