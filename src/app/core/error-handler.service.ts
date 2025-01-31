import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NotAuthenticatedError } from '../seguranca/money-http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private messageService: MessageService,
    private router: Router
  ) { }


  handle(errorResponse: any) {
    let msg: string

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } else if (errorResponse instanceof NotAuthenticatedError) {
      this.router.navigate(['/login'])
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Sua sessão expirou' });
      return
    }

    else if (errorResponse instanceof HttpErrorResponse && errorResponse.status >= 400 && errorResponse.status <= 499) {
      msg = 'Ocorreu um erro ao processar a sua solicitação'

      if (errorResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
      }

      try {
        msg = errorResponse.error[0].mensagemUsuario
      } catch (e) { }

    } else {
      msg = 'Erro ao processar serviço remoto. Tente Novamente.'
      console.error('Ocorreu um erro', errorResponse)
    }

    this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
  }

}