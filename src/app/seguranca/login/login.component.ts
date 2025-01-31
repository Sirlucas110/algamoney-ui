import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ButtonModule, CommonModule, InputTextModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa o FormGroup com validações
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  ngOnInit(): void { }

  public login(): void {
    const { usuario, senha } = this.loginForm.value;

    this.authService.login(usuario, senha).subscribe(() => {
      this.router.navigate(['/'])
    })
  }
}
