import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { CurrencyMaskModule } from 'ng2-currency-mask';

import { MessageComponent } from "../../shared/message/message.component";

import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule, DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

import { CategoriaService } from '../../categorias/categoria.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { catchError, EMPTY, of } from 'rxjs';
import { PessoaService } from '../../pessoas/pessoa.service';
import { Lancamento } from '../../core/model';
import { LancamentoService } from '../lancamento.service';



@Component({
  selector: 'app-lancamento-cadastro',
  standalone: true,
  imports: [InputTextareaModule, ButtonModule, CalendarModule, CommonModule, InputTextModule, SelectButtonModule, DropdownModule, FormsModule, CurrencyMaskModule, MessageComponent, InputNumberModule, RouterLink, ReactiveFormsModule, FileUploadModule, TooltipModule, ProgressSpinnerModule],
  providers: [LancamentoService, DatePipe],
  templateUrl: './lancamento-cadastro.component.html',
  styleUrl: './lancamento-cadastro.component.css'
})
export class LancamentoCadastroComponent {

  categoria: any[] = []
  pessoas: any[] = []
  //lancamento = new Lancamento();
  formulario!: FormGroup
  uploadEmAndamento = false;


  constructor(
    private categoriaService: CategoriaService,
    private errorHandler: ErrorHandlerService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.configurarFormulario();
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

  get uploadHeaders(){
    return this.lancamentoService.uploadHeaders();
  }

  get urlUploadAnexo(){
    return this.lancamentoService.urlUploadAnexo();
  }

  antesUploadAnexo(){
    this.uploadEmAndamento = true;
  }


  aoTerminarUploadAnexo(event: any){
    const anexo = event.originalEvent.body;

    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: anexo.url.replace('\\\\', 'https://')
    })

    this.uploadEmAndamento = false
  }

  erroUpload(event: any){
    this.messageService.add({severity: 'error',detail: 'Erro ao tentar enviar anexo!'})

    this.uploadEmAndamento = false
  }

  get nomeAnexo(){
    const nome = this.formulario.get('anexo')?.value
    console.log(nome)
    if (nome){
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }

    return '';
  }

  configurarFormulario(){
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []
    })
  }

  validarObrigatoriedade(input: FormControl){
    if (input.value == ''){
      return {obrigatoriedade: true}
    }
    return null
    //return (input.value ? null : {obrigatoriedade: true})
  }

  validarTamanhoMinimo(valor: number){
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : {tamanhoMinimo: {tamanho: valor}}
    }
  }

  get editando() {
    return Boolean(this.formulario.get('codigo')?.value)
  }

  salvar() {
    if (this.editando) {
      this.atualizarLancamento()
    } else {
      this.adicionarLancamento()
    }
  }

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario.value).pipe(
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

  atualizarLancamento() {
    this.lancamentoService.atualizarLancamento(this.formulario.value).pipe(
      catchError(erro => {
        this.errorHandler.handle(erro);
        return EMPTY
      })
    ).subscribe({
      next: (lancamento) => {
        //this.lancamento = lancamento;
        this.formulario.patchValue(lancamento)

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
        //this.lancamento = lancamento
        this.formulario.patchValue(lancamento);
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

  novo(){
    this.formulario.reset()

    this.formulario.patchValue(new Lancamento())
    
    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTitutloEdicao(){
    this.title.setTitle(`Edição de lançamento: ${this.formulario.get('descricao')?.value}`)
  }
}
