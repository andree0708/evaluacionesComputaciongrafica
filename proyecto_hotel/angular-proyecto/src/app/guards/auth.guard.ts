import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Si es admin intentando acceder a admin, permitir
    if (state.url.includes('/admin') && authService.isAdmin()) {
      return true;
    }
    // Si es cliente, permitir acceso a reservas
    if (!state.url.includes('/admin')) {
      return true;
    }
    // Cliente intentando acceder a admin, redirigir
    router.navigate(['/reserva']);
    return false;
  }

  // No autenticado, guardar URL y redirigir a login
  sessionStorage.setItem('returnUrl', state.url);
  router.navigate(['/login']);
  return false;
};
