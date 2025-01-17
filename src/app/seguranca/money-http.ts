import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { from, mergeMap, Observable } from 'rxjs';

export class NotAuthenticatedError {}

@Injectable()
export class MoneyHttpInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verifica se a requisição não é para /oauth2/token e se o token de acesso é inválido
    if (!req.url.includes('/oauth2/token') && this.auth.isAccessTokenInvalido()) {
      return from(this.auth.obterNovoAccessToken()).pipe(
        mergeMap(() => {
          if (this.auth.isAccessTokenInvalido()) {
            throw new NotAuthenticatedError(); // Lança erro se o token for inválido
          }

          // Clona a requisição e adiciona o cabeçalho Authorization com o novo token
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });

          // Prossegue com a requisição
          return next.handle(req);
        })
      );
    }

    // Caso o token seja válido, apenas prossegue com a requisição
    return next.handle(req);
  }
}
