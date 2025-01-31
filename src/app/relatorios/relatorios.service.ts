import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {

  lancamentosUrl: string;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { 
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`
  }

  relatorioLancamentosPorPessoa(inicio: Date, fim: Date): Observable<any>{
    const params = new HttpParams()
      .set('inicio', this.datePipe.transform(inicio, 'yyyy-MM-dd')!)
      .set('fim', this.datePipe.transform(fim, 'yyyy-MM-dd')!)


    return this.http.get(`${this.lancamentosUrl}/relatorios/por-pessoa`, {params, responseType: 'blob'})
  }
}
