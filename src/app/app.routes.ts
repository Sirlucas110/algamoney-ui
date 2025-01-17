import { Routes } from '@angular/router';
import { LancamentoPesquisaComponent } from './lancamentos/lancamento-pesquisa/lancamento-pesquisa.component';
import { LancamentoCadastroComponent } from './lancamentos/lancamento-cadastro/lancamento-cadastro.component';
import { PessoaPesquisaComponent } from './pessoas/pessoa-pesquisa/pessoa-pesquisa.component';
import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';
import { PessoaCadastroComponent } from './pessoas/pessoa-cadastro/pessoa-cadastro.component';
import { NaoAutorizadoComponent } from './core/nao-autorizado.component';
import { authGuard } from './seguranca/auth.guard';
import { AuthorizedComponent } from './seguranca/authorized/authorized.component';
import { LoginComponent } from './seguranca/login/login.component';

export const routes: Routes = [

    {path: '', redirectTo: 'lancamentos', pathMatch: 'full'},
    {
        path: 'login', component: LoginComponent
    },

    {
        path: 'lancamentos', 
        component: LancamentoPesquisaComponent, 
        canActivate: [authGuard],
        data: { roles: ['ROLE_PESQUISAR_LANCAMENTO'] }
    },
    {
        path: 'lancamentos/novo', 
        component: LancamentoCadastroComponent,
        canActivate: [authGuard],
        data: { roles: ['ROLE_CADASTRAR_LANCAMENTO'] }
        
    },
    {
        path: 'lancamentos/:codigo', 
        component: LancamentoCadastroComponent,
        canActivate: [authGuard],
        data: { roles: ['ROLE_CADASTRAR_LANCAMENTO'] }
    },
    {
        path: 'pessoas', 
        component: PessoaPesquisaComponent,
        canActivate: [authGuard],
        data: { roles: ['ROLE_PESQUISAR_PESSOA'] }
    },
    {
        path: 'pessoas/novo', 
        component: PessoaCadastroComponent,
        canActivate: [authGuard],
        data: { roles: ['ROLE_CADASTRAR_PESSOA'] }

    },
    {
        path: 'pessoas/:codigo', 
        component: PessoaCadastroComponent,
        canActivate: [authGuard],
        data: { roles: ['ROLE_CADASTRAR_PESSOA'] }
    },
    {
        path: 'authorized',
        component: AuthorizedComponent 
    },
   
    {
        path: 'nao-autorizado', 
        component: NaoAutorizadoComponent,
        canActivate: [authGuard]
    },
    {path: '**', component: PaginaNaoEncontradaComponent}
    
];
