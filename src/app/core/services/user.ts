import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = environment.apiUrl + '/user';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> { return this.http.get<User[]>(this.apiUrl); }
  create(user: User): Observable<User> { return this.http.post<User>(this.apiUrl, user); }
  update(id: number, user: User): Observable<User> { return this.http.put<User>(`${this.apiUrl}/${id}`, user); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}