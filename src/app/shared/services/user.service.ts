import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users = new BehaviorSubject<User[]>([]);
  users$ = this.users.asObservable();
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users`)
      .pipe(tap((users) => this.users.next(users)));
  }

  addUser(newUser: Omit<User, 'id'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, newUser).pipe(
      tap(() => {
        this.fetchUsers().subscribe();
      })
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`).pipe(
      tap(() => {
        this.fetchUsers().subscribe();
      })
    );
  }

  getUsers(): User[] {
    return this.users.getValue();
  }
}
