import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environments';
import { NotAuthenticatedError } from './money-http';
import { StorageService } from './storage.service';


interface TokenResponse { token: string, refreshToken: string }

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  accessTokenUrl = environment.apiUrl + '/auth';
  refreshTokenUrl = environment.apiUrl + '/auth/refresh-token';
  jwtPayload: any;


  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private storage: StorageService,
    private router: Router

  ) {
    this.carregarToken();
  }

  login(login: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.accessTokenUrl, { login, password }).pipe(
      tap(response => {
        this.armazenarToken(response.token)
        this.armazenarRefreshToken(response.refreshToken)
        return response
      }),
      catchError((err, obs) => {
        throw new NotAuthenticatedError()
      })
    )
  }

  refreshToken(): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.refreshTokenUrl, { refreshToken: this.storage.getItem("refreshToken") })
    .pipe(
      tap(response => {
        this.armazenarToken(response.token)
        this.armazenarRefreshToken(response.refreshToken)
        return response
      }),
      catchError((err, obs) => {
          throw new NotAuthenticatedError()
        })
      )
  }

  isAccessTokenInvalido(): boolean {
    const token: string = this.storage.getItem('token') ?? '';
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  isTokenPresent(): boolean {
    return !!this.storage.getItem('token')
  }

  temPermissao(permissao: string): boolean {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles: any[]): boolean {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  private armazenarToken(token: string): void {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    this.storage.setItem('token', token);
  }

  private armazenarRefreshToken(refreshToken: string): void {
    this.storage.setItem('refreshToken', refreshToken);
  }

  public carregarToken(): void {
    const token = this.storage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

  public carregarRefreshToken(): void {
    const refreshToken = this.storage.getItem('refreshToken');

    if (refreshToken) {
      this.armazenarRefreshToken(refreshToken);
    }
  }

  limparAccessToken(): void {
    this.storage.removeItem('token');
    this.storage.removeItem('refreshToken');
    this.jwtPayload = null;
  }


  logout(): void {
    this.limparAccessToken();
    this.router.navigate(['/login'])
  }
}