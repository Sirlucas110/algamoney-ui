import { Component, ErrorHandler } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { MessageComponent } from "../../shared/message/message.component";
import { MessageService } from 'primeng/api';
import { Contato, Pessoa } from '../../core/model';
import { PessoaService } from '../pessoa.service';
import { catchError, EMPTY, filter } from 'rxjs';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { ViaCepService } from '../../endereco/via-cep.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PessoaCadastroContatoComponent } from "../pessoa-cadastro-contato/pessoa-cadastro-contato.component";

@Component({
  selector: 'app-pessoa-cadastro',
  standalone: true,
  imports: [InputTextModule, ButtonModule, InputMaskModule, FormsModule, MessageComponent, RouterLink, PanelModule, TableModule, TooltipModule, CommonModule, DialogModule, PessoaCadastroContatoComponent],
  templateUrl: './pessoa-cadastro.component.html',
  styleUrl: './pessoa-cadastro.component.css'
})
export class PessoaCadastroComponent {
  
  pessoas = new Pessoa();
  
  
  constructor(
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private pessoaService: PessoaService,
    private viacepService: ViaCepService,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  
  
  
  ngOnInit(): void {
    const codigoPessoa = this.route.snapshot.params['codigo']
    
    this.title.setTitle('Nova Pessoa')
    
    if (codigoPessoa && codigoPessoa !== 'novo') {
      this.carregarPessoas(codigoPessoa)
    }
    
  }
  
  
  
  get editando() {
    return Boolean(this.pessoas.codigo)
  }

  buscarEndereco() {
    const cep = this.pessoas.endereco.cep?.replace('-', '') // Pegando o valor do CEP

    if (cep && cep.length === 8) {  // Verifica se o CEP tem 8 caracteres
      this.viacepService.buscarCep(cep).pipe(
        catchError(erro => {
          this.errorHandler.handle(erro);  // Chama o handler de erro
          return EMPTY;  // Retorna um observable vazio para continuar o fluxo
        })
      ).subscribe({
        next: (dados) => {
          // Preenche os campos com os dados do endereço
          this.pessoas.endereco.logradouro = dados.logradouro || '';
          this.pessoas.endereco.bairro = dados.bairro || '';
          this.pessoas.endereco.cidade = dados.localidade || '';
          this.pessoas.endereco.estado = dados.uf || '';
          this.pessoas.endereco.complemento = dados.complemento || '';
        },
        error: (erro) => {
          this.errorHandler.handle(erro);  // Tratamento de erro, caso o catchError não capture
        }
      });
    } else {
      console.error('CEP inválido');
    }
  }

  salvar(pessoaForm: NgForm) {
    if (this.editando) {
      this.editarPessoa(pessoaForm)
    } else {
      this.cadastrarPessoas(pessoaForm)
    }
  }

  cadastrarPessoas(pessoaForm: NgForm) {
    this.pessoaService.adicionarPessoas(this.pessoas).pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return EMPTY
      })
    ).subscribe({
      next: pessoaAdicionada => {

        this.messageService.add({ severity: 'success', detail: 'Pessoa criada com sucesso!' })
        
        this.router.navigate(['/pessoas', pessoaAdicionada.codigo ])
      }
    })
  }

  carregarPessoas(codigo: number) {
    this.pessoaService.buscaPorCodigo(codigo).pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return EMPTY
      })
    ).subscribe({
      next: (pessoa) => {
        this.pessoas = pessoa
        this.atualizarTitutloEdicao()
      }
    })
  }

  editarPessoa(pessoaForm: NgForm) {
    this.pessoaService.atualizarPessoa(this.pessoas).pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return EMPTY
      })
    ).subscribe({
      next: (pessoa) => {
        this.pessoas = pessoa

        this.messageService.add({ severity: 'success', detail: 'Pessoa alterada com sucesso!' })

        this.atualizarTitutloEdicao()
      }
    })
  }

  novo(pessoaForm: NgForm) {
    pessoaForm.resetForm()

    setTimeout(() => {
      this.pessoas = new Pessoa()
    }, 1)

    this.router.navigate(['/pessoas/novo'])

  }

  atualizarTitutloEdicao() {
    this.title.setTitle(`Edição de pessoa: ${this.pessoas.nome}`)
  }
}
