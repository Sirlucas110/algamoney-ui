import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  lancamentoUrl: string;

  constructor(
    private http: HttpClient
  ) { 
    this.lancamentoUrl = `${environment.apiUrl}/lancamentos`;
  }

  lancamentosPorCategoria(): Observable<any[]>{
    return this.http.get<any>(`${this.lancamentoUrl}/estatisticas/por-categoria`).pipe(
      map((response: any) => {
        return response
      })
    )
  }

  lancamentosPorDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.lancamentoUrl}/estatisticas/por-dia`).pipe(
      map((dados: any[]) => {
        return this.converterStringParaDatas(dados);
      })
    );
  }
  
  private converterStringParaDatas(dados: any[]): any[] {
    return dados.map(dado => ({
      ...dado,
      dia: new Date(dado.dia) // Apenas converte a string para um Date corretamente
    }));
  }
  
}
