import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../error-handler.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../seguranca/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {


  exibindoMenu = false;
  usuarioLogado: string = '';
  profile: any
  
  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private router: Router,
  
  ) {
    console.log(this.route.snapshot.params); // Exemplo
  }
  ngOnInit(){
    this.usuarioLogado = this.auth.jwtPayload?.nome;
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }
  
  logout() {
    this.auth.logout().pipe(
      catchError(erro => {
        this.errorHandler.handle(erro)
        return erro
      })
    ).subscribe({
      next: () => {
        this.auth.login()
      }
    })
  }
    
 }

    


