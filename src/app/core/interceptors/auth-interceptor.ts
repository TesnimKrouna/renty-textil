import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Récupère le token sauvegardé par ton Login
  const token = localStorage.getItem('token');

  // 2. Si un token existe, on clone la requête et on ajoute le header
  if (token) {
    // Cloner est obligatoire car les requêtes HTTP sont immuables
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // 3. On laisse passer la requête modifiée
    return next(clonedRequest);
  }

  // 4. Si pas de token, on laisse passer la requête originale
  return next(req);
};