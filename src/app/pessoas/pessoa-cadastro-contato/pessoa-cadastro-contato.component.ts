import { Component, Input } from '@angular/core';
import { Contato } from '../../core/model';
import { TableModule } from 'primeng/table';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { MessageComponent } from "../../shared/message/message.component";
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-pessoa-cadastro-contato',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, InputMaskModule, CommonModule, FormsModule, TooltipModule, MessageComponent, InputTextModule],
  templateUrl: './pessoa-cadastro-contato.component.html',
  styleUrl: './pessoa-cadastro-contato.component.css'
})
export class PessoaCadastroContatoComponent {

  @Input() contatos: Array<Contato> = [];
  contato!: Contato;
  exibindoFormularioContato = false;
  contatoIndex!: number;







  prepararNovoContato() {
      this.exibindoFormularioContato = true;
      this.contato = new Contato();
      this.contatoIndex = this.contatos.length;
    }
    
    prepararEdicaoContato(contato: Contato, index: number){
      this.contato = this.clonarContato(contato);
      this.exibindoFormularioContato = true
      this.contatoIndex = index;
    }
  
    confirmarContato(frm: NgForm) {
      this.contatos[this.contatoIndex] = this.clonarContato(this.contato)
      
      this.exibindoFormularioContato = false
  
      frm.resetForm()
    }
  
    removerContato(index: number){
      this.contatos.splice(index, 1);
    }
  
    clonarContato(contato: Contato): Contato{
      return new Contato(contato.codigo, contato.nome, contato.email, contato.telefone);
    }

    get Editando(){
      return Boolean(this.contato.codigo)
    }

}
