import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Types des rôles possibles
export type UserRole = 'ADMIN'|'PRODUCT_MANAGER'|'FINANCE_MANAGER';

// Utilisateur stocké après connexion
export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// Réponse attendue du backend après login
export interface LoginResponse {
  token: string;
  user: CurrentUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object   // ← pour détecter le navigateur
  ) {
    // Ne lit le localStorage que dans un vrai navigateur
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem(this.USER_KEY);
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser) as CurrentUser;
          this.currentUserSubject.next(user);
        } catch (e) {
          localStorage.removeItem(this.USER_KEY);
        }
      }
    }
  }

  /** Authentification */
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => this.setSession(response))
      );
  }

  /** Déconnexion */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  /** Token stocké */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /** Utilisateur courant */
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  /** Vérifications de rôle */
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }

  isManagerProduit(): boolean {
    return this.getCurrentUser()?.role === 'PRODUCT_MANAGER';
  }

  isManagerFinance(): boolean {
    return this.getCurrentUser()?.role === 'FINANCE_MANAGER';
  }

  // ----- Méthodes privées -----
  private setSession(authResult: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, authResult.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    }
    this.currentUserSubject.next(authResult.user);
  }

  // ----- Méthodes temporaires (à brancher plus tard) -----
  register(data: any): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(500));
  }

  forgotPassword(email: string): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(500));
  }

  resetPassword(data: { token: string; password: string }): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(500));
  }
}