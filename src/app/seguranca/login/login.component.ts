import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  template: '',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getLoginRedirectUrl().subscribe({
      next: (url) => {
        window.location.href = url; // Realiza o redirecionamento
      },
      error: (err) => {
        console.error('Erro ao obter URL de login:', err);
        // Você pode exibir uma mensagem de erro ao usuário, se necessário
      },
    });
  }
}
