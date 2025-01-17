import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-authorized',
  standalone: true,
  imports: [],
  templateUrl: './authorized.component.html',
  styleUrl: './authorized.component.css'
})
export class AuthorizedComponent {


  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private route: Router
  ){}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) =>{
      if (params.code) {
        this.auth.obterNovoAccessTokenComCode(params.code, params.state).subscribe({
          next: () => {
            this.route.navigate(['/'])
          }
        })
      } else{
        this.route.navigate(['/'])
      }
    } )
  }
}