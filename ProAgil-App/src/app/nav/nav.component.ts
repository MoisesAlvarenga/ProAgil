import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  showMenu() {
    return this.router.url !== '/user/login'
  }

  loggedIn(){
    return this.authService.loggedIn();
  }

  entrar(){
    this.router.navigate(['/user/login']);
  }

  logout(){
    localStorage.removeItem('token');
    this.toastr.show('Log Out');
    this.router.navigate(['/user/login']);
  }


  userName(){
   return localStorage.getItem('userName');
  }

}
