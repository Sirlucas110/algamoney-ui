import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { NotAuthenticatedError } from './money-http';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isTokenPresent()) throw new NotAuthenticatedError()
  if (!authService.isAccessTokenInvalido()) return verificarPermissao(route, authService, router)
  return authService.refreshToken().pipe(() => {
    return verificarPermissao(route, authService, router)
  })
}

// Função auxiliar para verificar permissões
function verificarPermissao(route: ActivatedRouteSnapshot, auth: AuthService, router: Router): Observable<boolean> {
  if (route.data?.['roles'] && !auth.temQualquerPermissao(route.data['roles'])) {
    router.navigate(['/nao-autorizado']);
    return of(false);
  }
  return of(true);
}