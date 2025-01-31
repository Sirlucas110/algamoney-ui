import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { RelatoriosService } from '../relatorios.service';

@Component({
  selector: 'app-relatorio-lancamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, ButtonModule],
  providers: [RelatoriosService],
  templateUrl: './relatorio-lancamentos.component.html',
  styleUrl: './relatorio-lancamentos.component.css'
})
export class RelatorioLancamentosComponent implements OnInit {

  periodoInicio!: Date;
  periodoFim!: Date;

  constructor(
    private relatoriosService: RelatoriosService
  ){}

  ngOnInit(): void {
      
  }

  gerar() {
    this.relatoriosService.relatorioLancamentosPorPessoa(this.periodoInicio, this.periodoFim).subscribe({
      next: (relatorio) => {
        const url = window.URL.createObjectURL(relatorio);

        window.open(url)
      }
    })
  }

}
