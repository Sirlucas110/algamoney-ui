import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  
  categoriasUrl: string;

  constructor(private http: HttpClient) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;  
   }

  listarCategorias(): Observable<any[]>{
   
  

    return this.http.get<any[]>(this.categoriasUrl)

  }
}
