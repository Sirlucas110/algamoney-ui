import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAccessTokenInvalido()) {
    return auth.obterNovoAccessToken().pipe(
      switchMap(() => {
        if (auth.isAccessTokenInvalido()) {
          router.navigate(['/login'])
          return of(false);
        }
        return verificarPermissao(route, auth, router);
      }),
      catchError(() => {
        auth.login();
        return of(false);
      })
    );
  }

  return verificarPermissao(route, auth, router);
};

// Função auxiliar para verificar permissões
function verificarPermissao(route: any, auth: AuthService, router: Router): Observable<boolean> {
  if (route.data?.['roles'] && !auth.temQualquerPermissao(route.data['roles'])) {
    router.navigate(['/nao-autorizado']);
    return of(false);
  }
  return of(true);
}
