import { bootstrapApplication } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app/app.component";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter, withComponentInputBinding} from "@angular/router";
import { routes } from "./app/app.routes";
import { importProvidersFrom } from "@angular/core";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "./environments/environments";
import  {  provideOAuthClient  }  from 'angular-oauth2-oidc' ;


export function tokenGetter() {
  return localStorage.getItem("access_token");
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    importProvidersFrom(
    BrowserAnimationsModule),
    provideOAuthClient(),
    JwtHelperService,
    {provide: JWT_OPTIONS, useValue: {}},
  

    
    
  ],
});

