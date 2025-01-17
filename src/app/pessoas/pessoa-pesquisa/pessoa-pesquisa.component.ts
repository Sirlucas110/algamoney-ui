import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { PessoaFiltro, PessoaService } from '../pessoa.service';
import { FormsModule } from '@angular/forms';
import { catchError, EMPTY, of } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { RouterLink, RouterModule } from '@angular/router';



@Component({
  selector: 'app-pessoa-pesquisa',
  standalone: true,
  imports: [ButtonModule, TableModule, InputTextModule, TooltipModule, CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './pessoa-pesquisa.component.html',
  styleUrl: './pessoa-pesquisa.component.css'
})
export class PessoaPesquisaComponent {

  filtro = new PessoaFiltro();
  pessoas: any[] = [];
  totalRegistros: number = 0


  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
  ) { }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro).subscribe(
      response => {
        this.pessoas = response.pessoas;
        this.totalRegistros = response.total
      })
  }

  listarPessoas() {
    this.pessoaService.listarTodas().subscribe(
      pessoas => {
        this.pessoas = pessoas
      }
    )
  }
  aoMudarPagina(event: TableLazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;
    this.pesquisar(pagina)
  }

  excluir(pessoa: any) {
    this.pessoaService.excluirPessoa(pessoa.codigo).pipe(
      catchError(erro => {
        // Lida com o erro e exibe a mensagem
        this.errorHandler.handle(erro);
        return EMPTY; // Retorna null para evitar que o fluxo de sucesso seja disparado
      })
    ).subscribe({
      next: () => {
        // Exibe a mensagem de sucesso assim que a exclusão for bem-sucedida
        this.messageService.add({ severity: 'success', detail: 'Pessoa excluída com sucesso!' });

        // Recarrega a lista na página atual
        this.pesquisar(this.filtro.pagina);
      }
    });
  }

  confirmarExclusao(pessoa: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa)
      }
    })
  }

  mudarStatus(pessoa: any){

    const novoStatus = !pessoa.ativo
    
    this.pessoaService.atualizarStatus(pessoa.codigo, novoStatus).subscribe({
      next: () => {
        const acao = novoStatus ? 'ativada' : 'desativada'
        pessoa.ativo = novoStatus
        this.messageService.add({severity: 'success', detail: `Pessoa ${acao} com sucesso!`})
      }
    })
  }

}
