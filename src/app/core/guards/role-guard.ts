import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Rôle requis passé via la propriété data de la route (ex: data: { role: 'ADMIN' })
    const requiredRole = route.data?.['role'] as string;
    const user = this.authService.getCurrentUser(); // ← plus de getRole()

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Un admin peut tout voir
    if (user.role === 'ADMIN') return true;

    // Vérifie si l'utilisateur possède exactement le rôle requis
    if (requiredRole && user.role === requiredRole) return true;

    // Sinon, redirige vers une page non autorisée ou login
    this.router.navigate(['/unauthorized']);
    return false;
  }
}