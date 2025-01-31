import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { importProvidersFrom, inject } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { switchMap } from "rxjs";
import { NotAuthenticatedError } from "./app/seguranca/money-http";
import { AuthService } from "./app/seguranca/auth.service";


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([(req, next) => {
      const authService = inject(AuthService)
      if (req.url.includes('/auth')) return next(req)

      if (!authService.isTokenPresent()) throw new NotAuthenticatedError()
      if (authService.isAccessTokenInvalido()) {
        return authService.refreshToken().pipe(
          switchMap(response => {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`
              }
            });
            return next(req)
          })
        )
      }

      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      return next(req)
    }])),
    importProvidersFrom(
      BrowserAnimationsModule),
    provideOAuthClient(),
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: {} }
  ],
});

