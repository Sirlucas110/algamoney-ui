import {DatePipe} from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';

import { map, Observable } from 'rxjs';

import { Lancamento } from '../core/model';
import { environment } from '../../environments/environments';



export class LancamentoFilter{
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
    private datePipe: DatePipe
  ) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`
  }

  pesquisar(filtro: LancamentoFilter): Observable<any>{


      let params = new HttpParams()
        .set('page', filtro.pagina)
        .set('size', filtro.itensPorPagina);

      if (filtro.descricao){
        params = params.set('descricao', filtro.descricao)
      }

      if (filtro.dataVencimentoInicio) {
        params = params.set('dataVencimentoDe', this.datePipe.transform(filtro.dataVencimentoInicio, 'yyyy-MM-dd')!)
      }

      if (filtro.dataVencimentoFim){
        params  = params.set('dataVencimentoAte', this.datePipe.transform(filtro.dataVencimentoFim, 'yyyy-MM-dd')!)
      }

    return this.http.get<LancamentoResponse>(`${this.lancamentosUrl}?resumo`, {params}).pipe(
      map((response) => ({
        lancamentos: response.content,
        total: response.totalElements,
      }))
    );   
  }
  
  adicionar(lancamento: Lancamento): Observable<Lancamento> {
  
    return this.http.post<Lancamento>(this.lancamentosUrl, lancamento);
  }

  atualizarLancamento(lancamento: Lancamento):Observable<Lancamento>{

      return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento).pipe(
        map((response: any) => {
          this.converterStringsParaDatas([response])
          return response
        })
      )
  }

  buscaPorCodigo(codigo: number): Observable<Lancamento> {
      

    return this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`).pipe(
      map((response: Lancamento) => {
        this.converterStringsParaDatas([response]);
        return response;
      })
    );
  }
  
  
  excluirLancamento(codigo: number): Observable<any>{

    return this.http.delete(`${this.lancamentosUrl}/${codigo}`)

  }


  private converterStringsParaDatas(lancamentos: Lancamento[]){
    for (const lancamento of lancamentos) {
      let offset = new Date().getTimezoneOffset() * 60000;

      lancamento.dataVencimento = new Date(new Date(lancamento.dataVencimento!).getTime() + offset);

      if (lancamento.dataPagamento){
        lancamento.dataPagamento = new Date(new Date(lancamento.dataPagamento).getTime() + offset);
      }
    }
  }

  

  
  
  
  
}
