import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';



import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from './dashboard.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PanelModule, ChartModule],
  providers: [DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  pieChartData: any
  lineChartData: any;

  optionsLine = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any): any => {
            let label = context.dataset.label || '';
            let value = context.raw || 0;
            let formattedValue = this.decimalPipe.transform(value, '1.2-2', 'pt_BR');
            return `${label}: ${formattedValue}`;
          }
        }
      }
    },
    scales: {
      x: {
        // Define os dias do mês dinamicamente
        labels: this.configurarDiaMes(), // Garante que o eixo X mostre até o último dia
        min: 1,  // Começa do dia 1
        max: this.configurarDiaMes().length, // Define o último dia como o tamanho do array de dias
        ticks: {
          stepSize: 1 // Exibe todos os dias do mês
        }
      }
    }
  }

  optionsPie = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any): any => {
            let label = context.label || '';
            let value = context.raw || 0;
            let formattedValue = this.decimalPipe.transform(value, '1.2-2', 'pt_BR');
            return `${label}: ${formattedValue}`;
          }
        }
      }
    }
  }

  constructor(
    private dashboardService: DashboardService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit() {
    this.configurarGraficoPizza();
    this.configurarGraficoLinha();
  }

  /*configurarGraficoBarra(){
  
  }*/

  configurarGraficoPizza() {
    this.dashboardService.lancamentosPorCategoria().subscribe({
      next: (dados) => {
        this.pieChartData = {
          labels: dados.map(dado => dado.categoria.nome),
          datasets: [
            {
              data: dados.map(dado => dado.total),
              backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC']
            }
          ]
        };
      }
    })
  }

  configurarGraficoLinha(){
    this.dashboardService.lancamentosPorDia().subscribe({
      next: dados => {
        const diasDoMes = this.configurarDiaMes();
        const totaisReceitas = this.totaisPorCadaDiaMes(
          dados.filter(dado => dado.tipo === 'RECEITA'), diasDoMes
        );
        const totaisDespesas = this.totaisPorCadaDiaMes(
          dados.filter(dado => dado.tipo === 'DESPESA'), diasDoMes
        );
        this.lineChartData = {
          labels: diasDoMes,
          datasets: [
            {
              label: 'Receitas',
              data: totaisReceitas,
              borderColor: '#3366CC'
            }, {
              label: 'Despesas',
              data: totaisDespesas,
              borderColor: '#D62B00'
            }
          ]
        }
      }
    })
  }

  private totaisPorCadaDiaMes(dados: any[], diasDoMes: number[]): number[] {
    const totais: number[] = [];
  
    for (const dia of diasDoMes) {
      let total = 0;
  
      for (const dado of dados) {
        const data = new Date(dado.dia); // Converte a string para Date
  
        // Compara ano, mês e dia
        if (data.getFullYear() === new Date().getFullYear() &&
            data.getMonth() === new Date().getMonth() &&
            data.getDate() === dia) {
          total = dado.total;
          break;
        }
      }
  
      totais.push(total); // Adiciona o total, mesmo que seja 0
    }
  
    return totais;
  }
  
  //Configuraçao do eixo X
  private configurarDiaMes(): number[] {
    const mesReferencia = new Date();
    mesReferencia.setMonth(mesReferencia.getMonth() + 1); // Mês seguinte
    mesReferencia.setDate(0); // Último dia do mês atual
  
    const quantidade = mesReferencia.getDate(); // Número de dias no mês
    const dias: number[] = [];
  
    for (let i = 1; i <= quantidade; i++) {
      dias.push(i); // Cria um array com todos os dias do mês
    }
  
    console.log('Dias do mês:', dias); // Verifique o array com os dias do mês
    return dias;
  }

  

}
