import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NotAuthenticatedError } from '../seguranca/money-http';
import { AuthService } from '../seguranca/auth.service';




@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private auth: AuthService,
    private messageService: MessageService,
  ) { }
  
  
  handle(errorResponse: any){
    let msg: string

    if (typeof errorResponse === 'string'){
      msg = errorResponse;
    } else if(errorResponse instanceof NotAuthenticatedError) {
      console.log('errorResponse', errorResponse)
      msg = 'Sua sessão expirou';
      this.auth.login()
    }
    
    else if(errorResponse instanceof HttpErrorResponse && errorResponse.status >= 400 && errorResponse.status <= 499){
      msg = 'Ocorreu um erro ao processar a sua solicitação'

      if(errorResponse.status === 403){
        msg = 'Você não tem permissão para executar esta ação';
      }

      try {
        msg = errorResponse.error[0].mensagemUsuario
      } catch (e){}

      console.log('Ocorreu erro', errorResponse)

    }else {
      msg = 'Erro ao processar serviço remoto. Tente Novamente.'
      console.error('Ocorreu um erro', errorResponse)
    }

    this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
  }

}
