import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmationService, MessageService } from 'primeng/api';

import { LancamentoFilter, LancamentoService } from '../lancamento.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { catchError, of } from 'rxjs';
import { RouterLink, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-lancamento-pesquisa',
  standalone: true,
  imports: [InputTextModule, ButtonModule, TableModule, TooltipModule, CommonModule, FormsModule, CalendarModule, RouterLink],
  providers: [LancamentoService, DatePipe],
  templateUrl: './lancamento-pesquisa.component.html',
  styleUrl: './lancamento-pesquisa.component.css'
})
export class LancamentoPesquisaComponent {
[x: string]: any;

  filtro = new LancamentoFilter();
  lancamentos: any[] = [];
  totalRegistros: number = 0;
  @ViewChild('tabela') grid: any;

  constructor(
    private lancamentoService: LancamentoService, 
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,

    //Serve para alterar o titulo da pagina
    private title: Title
  ){}

  ngOnInit() {
    //this.pesquisar();
    this.title.setTitle('Pesquisa de lançamentos')
  }

  /*naoTemPermissao(permissao: string) {
    return !this.auth.temPermissao(permissao);
  }*/

  pesquisar(pagina: number = 0){ 
    this.filtro.pagina = pagina;
    this.lancamentoService.pesquisar(this.filtro).pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return of({lancamentos: [], total: 0})
      })
    ).subscribe(response => {
        this.lancamentos = response.lancamentos;
        this.totalRegistros = response.total;
      })
      
  }

  aoMudarPagina(event: TableLazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any){
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento)
      } 
    })
  }

  excluir(lancamento: any) {
    this.lancamentoService.excluirLancamento(lancamento.codigo).pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return of(null); // Retorna um valor nulo para continuar o fluxo
      })
    ).subscribe({
      next: () => { // Sem verificar o 'response'
        this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' });
    
        // Atualiza a tabela de lançamentos
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }
      },
      error: (erro) => {
        console.error('Erro ao excluir lançamento:', erro);
      },
    });
    
  }
  
}
