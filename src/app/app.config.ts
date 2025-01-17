import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch} from '@angular/common/http';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { tokenGetter } from '../main';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    JwtHelperService,
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS}
    
  
  ]
};
