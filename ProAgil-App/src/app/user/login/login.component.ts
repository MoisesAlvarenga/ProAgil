import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo:string = 'Login';

  model:any = {}
  constructor(private toastr: ToastrService, private authService: AuthService, public router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('token') !== null){
      this.router.navigate(['/dashboard']);
    }
  }

  login(){
    this.authService.login(this.model)
      .subscribe(
        () => {
          this.router.navigate(['/dashboard']);
          this.toastr.success('Logado com sucesso.');
        },
        error => {
          this.toastr.error('Falha ao tentar logar.');
        }
      )
  }

}
