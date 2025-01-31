import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Lancamento } from '../core/model';
import { environment } from '../../environments/environments';

import { DatePipe } from '@angular/common';


export class LancamentoFilter {
  descricao?: string;
  dataVencimentoInicio?: Date;
  dataVencimentoFim?: Date;
  pagina: number = 0;
  itensPorPagina: number = 5;
}

interface LancamentoResponse {
  content: any[];
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl: string;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
  ) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  uploadHeaders(){
    return new HttpHeaders()
      .append('Authorization', 'Bearer' + localStorage.getItem('token'))
  }

  urlUploadAnexo(): string{
    return `${this.lancamentosUrl}/anexo`;
  }

  // Método para adicionar um lançamento
  adicionar(lancamento: Lancamento): Observable<Lancamento> {




    return this.http.post<Lancamento>(this.lancamentosUrl, lancamento);
  }

  // Método para buscar lançamentos com filtro
  pesquisar(filtro: LancamentoFilter): Observable<any> {
    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe', this.datePipe.transform(filtro.dataVencimentoInicio, 'yyyy-MM-dd')!);
    }

    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', this.datePipe.transform(filtro.dataVencimentoFim, 'yyyy-MM-dd')!);
    }

    return this.http.get<LancamentoResponse>(`${this.lancamentosUrl}?resumo`, { params }).pipe(
      map((response) => ({
        lancamentos: response.content,
        total: response.totalElements,
      }))
    );
  }

  // Método para buscar um lançamento por código
  buscaPorCodigo(codigo: number): Observable<Lancamento> {

    return this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`).pipe(
      map((response: Lancamento) => {
        this.converterStringsParaDatas([response]);
        return response;
      })
    );
  }

  // Método para excluir um lançamento
  excluirLancamento(codigo: number): Observable<any> {
    return this.http.delete(`${this.lancamentosUrl}/${codigo}`);
  }

  // Método para atualizar um lançamento
  atualizarLancamento(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento).pipe(
      map((response: any) => {
        this.converterStringsParaDatas([response]);
        return response;
      })
    );
  }

  // Método para converter datas que estão como string para objetos Date
  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      let offset = new Date().getTimezoneOffset() * 60000;

      lancamento.dataVencimento = new Date(new Date(lancamento.dataVencimento!).getTime() + offset);

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = new Date(new Date(lancamento.dataPagamento).getTime() + offset);
      }
    }
  }
}
