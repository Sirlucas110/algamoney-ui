import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environments';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  tokensRevokeUrl = environment.apiUrl + '/tokens/revoke';
  oauthTokenUrl = environment.apiUrl + '/oauth2/token';
  oauthAuthorizeUrl = environment.apiUrl + '/oauth2/authorize';
  jwtPayload: any;


  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private storage: StorageService
    
  ) {
    this.carregarToken();
  }

  login(){
    const state = this.gerarStringAleatoria(40);

    this.storage.setItem('state', state);

    

    const redirectURI = encodeURIComponent(environment.oauthCallbackUrl);
    const clientId = 'angular';
    const scope = 'read write';
    const responseType = 'code';

    const params = [
      'response_type=' + responseType,
      'client_id=' + clientId,
      'scope=' + scope,
      'state=' + state,
      'redirect_uri=' + redirectURI
    ];

    return  this.oauthAuthorizeUrl + '?' + params.join('&');
  }

  getAuthUrl(): string{
    return this.login()
  }

  obterNovoAccessTokenComCode(code: string, state: string): Observable<any> {
    const stateSalvo = this.storage.getItem('state');

    if (stateSalvo !== state) {
      return throwError(() => new Error('Estado inválido'));
    }

    const payload = new HttpParams()
      .append('grant_type', 'authorization_code')
      .append('code', code)
      .append('redirect_uri', environment.oauthCallbackUrl)

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjoxMjM0NTY=');

    return this.http.post<any>(this.oauthTokenUrl, payload, { headers }).pipe(
      map((response: any) => {
        this.armazenarToken(response['access_token']);
        this.armazenarRefreshToken(response['refresh_token']);
        console.log('Novo access token criado!');
        
        this.storage.removeItem('state');
        
        return response;
      }),
      catchError((error) => {
        console.error('Erro ao gerar o token com o code.', error);
        return throwError(() => new Error('Erro ao gerar o token com o code.'));
      })
    );
  }

  getLoginRedirectUrl(): Observable<string> {
    // Substitua esta lógica pela real, se necessário
    return this.http.get<string>(`${this.oauthAuthorizeUrl}`);
  }

  obterNovoAccessToken(): Observable<any> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjoxMjM0NTY=');

    const payload = new HttpParams()
      .append('grant_type', 'refresh_token')
      .append('refresh_token', this.storage.getItem('refreshToken')!);

    return this.http.post<any>(this.oauthTokenUrl, payload, { headers }).pipe(
      map((response: any) => {
        this.armazenarToken(response['access_token']);
        this.armazenarRefreshToken(response['refresh_token']);
        console.log('Novo access token criado!');
      }),
      catchError((error) => {
        console.error('Erro ao renovar token.', error);
        return throwError(() => new Error('Erro ao renovar token.'));
      })
    );
  }

  isAccessTokenInvalido(): boolean {
    const token = this.storage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
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

  public armazenarToken(token: string): void {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    this.storage.setItem('token', token);
  }

  public carregarToken(): void {
    const token = this.storage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

  limparAccessToken(): void {
    this.storage.removeItem('token');
    this.jwtPayload = null;
  }

  private armazenarRefreshToken(refreshToken: string): void {
    this.storage.setItem('refreshToken', refreshToken);
  }

  private gerarStringAleatoria(tamanho: number): string {
    let resultado = '';
    // Chars que são URL safe
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < tamanho; i++) {
      resultado += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return resultado;
  }

  logout(): Observable<void> {
    return this.http.delete(this.tokensRevokeUrl, { withCredentials: true }).pipe(
      map(() => {
        this.limparAccessToken();
      }),
      catchError((error) => {
        console.error('Erro ao fazer logout.', error);
        return throwError(() => new Error('Erro ao fazer logout.'));
      })
    );
  }
}
