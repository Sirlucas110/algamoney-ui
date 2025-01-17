import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule, DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, NgForm } from '@angular/forms';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MessagesModule } from 'primeng/messages';
import { MessageComponent } from "../../shared/message/message.component";
import { InputNumberModule } from 'primeng/inputnumber';
import { CategoriaService } from '../../categorias/categoria.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { catchError, EMPTY, of } from 'rxjs';
import { PessoaService } from '../../pessoas/pessoa.service';
import { Lancamento } from '../../core/model';
import { MessageService } from 'primeng/api';
import { LancamentoService } from '../lancamento.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamento-cadastro',
  standalone: true,
  imports: [InputTextareaModule, ButtonModule, CalendarModule, CommonModule, InputTextModule, SelectButtonModule, DropdownModule, FormsModule, CurrencyMaskModule, MessageComponent, InputNumberModule, RouterLink],
  providers: [LancamentoService, DatePipe],
  templateUrl: './lancamento-cadastro.component.html',
  styleUrl: './lancamento-cadastro.component.css'
})
export class LancamentoCadastroComponent {

  categoria: any[] = []
  pessoas: any[] = []
  lancamento = new Lancamento();


  constructor(
    private categoriaService: CategoriaService,
    private errorHandler: ErrorHandlerService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    const codigoLancamento = this.route.snapshot.params['codigo']

    this.title.setTitle('Novo Lançamento')

    if (codigoLancamento && codigoLancamento !== 'novo') {
      this.carregarLancamento(codigoLancamento)
    }

    this.carregarCategorias()
    this.carregarPessoas()
  }

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  get editando() {
    return Boolean(this.lancamento.codigo)
  }

  salvar(lancamentoForm: NgForm) {
    if (this.editando) {
      this.atualizarLancamento(lancamentoForm)
    } else {
      this.adicionarLancamento(lancamentoForm)
    }
  }

  adicionarLancamento(lancamentoForm: NgForm) {
    this.lancamentoService.adicionar(this.lancamento).pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return EMPTY;
      })
    ).subscribe({
      next: lancamentoAdicionado => {
        this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso' });

        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo])

        // lancamentoForm.resetForm();
        // this.lancamento = new Lancamento();  // Limpa o objeto de lançamento
      }
    });
  }

  atualizarLancamento(lancamentoForm: NgForm) {
    this.lancamentoService.atualizarLancamento(this.lancamento).pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return EMPTY
      })
    ).subscribe({
      next: (lancamento) => {
        this.lancamento = lancamento;

        this.messageService.add({severity: 'success', detail: 'Lançamento alterado com sucesso!' })

        this.atualizarTitutloEdicao();
      }
    })
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscaPorCodigo(codigo).pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return EMPTY
      })
    ).subscribe({
      next: (lancamento) => {
        this.lancamento = lancamento
        this.atualizarTitutloEdicao()
      }
    })
  }

  carregarPessoas() {
    this.pessoaService.listarTodas().pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return of({ content: [] }); // Retorna um array vazio em caso de erro
      })
    ).subscribe({
      next: (response: any) => {
        this.pessoas = response.content.map((p: any) => ({
          label: p.nome,
          value: p.codigo
        }));
      },
      error: (erro) => {
        // Esse bloco pode ser omitido pois o erro já é tratado pelo catchError
        this.errorHandler.handle(erro);
      }
    });
  }

  carregarCategorias() {
    return this.categoriaService.listarCategorias().pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return EMPTY
      })
    ).subscribe({
      next: (categorias) => {
        this.categoria = categorias.map(c => ({
          label: c.nome, // Nome da categoria
          value: c.codigo // Código da categoria
        }))
      }
    })
  }

  novo(lancamentoForm: NgForm){
    lancamentoForm.resetForm();

    setTimeout(() => {
      this.lancamento = new Lancamento()
    }, 1)
    
    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTitutloEdicao(){
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`)
  }
}
