import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credit } from '../models/credit';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CreditService {
  private apiUrl = environment.apiUrl + '/credit';

  constructor(private http: HttpClient) {}

  
  getAll(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl);
  }


  update(clientId: number, projectId: number, credit: Credit): Observable<Credit> {
    return this.http.put<Credit>(`${this.apiUrl}/${clientId}/${projectId}`, credit);
  }

 
  create(credit: Credit): Observable<Credit> {
    return this.http.post<Credit>(this.apiUrl, credit);
  }

  
  delete(clientId: number, projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clientId}/${projectId}`);
  }
}