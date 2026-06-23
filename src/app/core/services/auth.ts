import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface LoginResponse {
  token: string;
  role: 'ADMIN' | 'EMPLOYE' | 'CLIENT';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  URL = environment.apiUrl
  private currentRole: 'ADMIN' | 'EMPLOYE' | 'CLIENT' | null = null;

  constructor(private http: HttpClient){}

  login(credentials: { email: string; password: string }){
    const response: LoginResponse = { token: 'fake-jwt-token', role: 'ADMIN' };
    this.currentRole = response.role; 

     this.http.post(this.URL+'/auth/login', credentials).subscribe((res:any)=>{
      return res
    })
  }

  register(data: any): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(500));
  }

  forgotPassword(email: string): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(500));
  }

  resetPassword(data: { token: string; password: string }): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(500));
  }

  // ➜ Méthode manquante
  getRole(): 'ADMIN' | 'EMPLOYE' | 'CLIENT' | null {
    return this.currentRole;
  }

  // Optionnel : pour déconnecter
  logout(): void {
    this.currentRole = null;
  }
}