import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { NavbarComponent } from "./core/navbar/navbar.component";

import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';


import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorHandlerService } from './core/error-handler.service';

// Factory para carregar os arquivos de tradução
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localePt, 'pt-BR')

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    ToastModule,
    ConfirmDialogModule,
    RouterOutlet,
  ],
  providers: [MessageService, ConfirmationService, ErrorHandlerService, DatePipe], // Garantir que DatePipe está aqui
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private config: PrimeNGConfig,
    private router: Router
  ) { }

  ngOnInit() {
    this.config.setTranslation({
      accept: 'Accept',
      reject: 'Cancel',
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      weekHeader: 'Sem'
    });
  }


  exibindoNavBar(){
    return this.router.url !== '/login';
  }
}
