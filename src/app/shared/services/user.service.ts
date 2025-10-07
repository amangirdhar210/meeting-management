import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users = new BehaviorSubject<User[]>([
    { id: 1, name: 'Admin User', role: 'admin', email: 'admin@example.com' },
    { id: 2, name: 'John Doe', role: 'user', email: 'john@example.com' },
  ]);
  users$ = this.users.asObservable();

  getUsers(): User[] {
    return this.users.getValue();
  }
  addUser(newUser: Omit<User, 'id'>): void {
    const users = this.getUsers();
    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const updatedUsers = [...users, { id: nextId, ...newUser }];
    this.users.next(updatedUsers);
  }

  deleteUser(id: number): void {
    const updatedUsers = this.getUsers().filter((u) => u.id !== id);
    this.users.next(updatedUsers);
  }
}
