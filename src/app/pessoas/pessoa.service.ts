import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pessoa } from '../core/model';
import { environment } from '../../environments/environments';



export class PessoaFiltro{
    nome: string = ''; // Filtro pelo nome da pessoa
    pagina: number = 0; // Número da página para paginação (começa na página 0).
    itensPorPagina: number = 5 // Quantidade de itens por página (limite).
}

interface PessoasResponse {
  content: any[]; // Lista de pessoas retornadas pela API.
  totalElements: number; // Total de pessoas disponíveis (para paginação).
}


@Injectable({
  providedIn: 'root'
})


export class PessoaService {

  pessoasUrl = 'http://localhost:8080/pessoas';

  constructor(
    private http: HttpClient
  ) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`
  }

  pesquisar(filtro: PessoaFiltro): Observable<any>{
      let params = new HttpParams()
        .set('page', filtro.pagina)
        .set('size', filtro.itensPorPagina)

      if (filtro.nome){
        params = params.set('nome', filtro.nome)
      }

      return this.http.get<PessoasResponse>(`${this.pessoasUrl}`, {params}).pipe(
        map((response) => ({
          pessoas: response.content,
          total: response.totalElements
        }))
      );
  }

  adicionarPessoas(pessoas: Pessoa): Observable<Pessoa>{

    return this.http.post<Pessoa>(this.pessoasUrl, pessoas)
  }

  listarTodas(): Observable<any[]>{

    return this.http.get<any[]>(this.pessoasUrl)

  }

  atualizarPessoa(pessoa: Pessoa): Observable<Pessoa>{


    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa)
  }

  buscaPorCodigo(codigo: number): Observable<Pessoa>{
  
    return this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`)
  }
  
  excluirPessoa(codigo: number): Observable<any>{

    return this.http.delete(`${this.pessoasUrl}/${codigo}`)

  }

  atualizarStatus(codigo: number, ativo: boolean): Observable<any>{


    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo)

  }


}
