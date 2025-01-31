import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
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
    private authService: AuthService

  ) {
  }
  ngOnInit() {
    this.usuarioLogado = this.authService.jwtPayload?.nome;
  }
  logout() {
    this.authService.logout();
  }




}



