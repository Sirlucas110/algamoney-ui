import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  constructor(
    private http: HttpClient
  ) { }

  cepUrl = 'https://viacep.com.br/ws'

  buscarCep(cep: string): Observable<any>{
        

    return this.http.get<any>(`${this.cepUrl}/${cep}/json/`)
  }
}
