import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  baseURL = 'https://localhost:5001/api/user/';

  jwtHelper = new JwtHelperService()
  decodedToken: any;

  login(model: any){
    return this.http
      .post(`${this.baseURL}login`, model).pipe(
        map((response: any) => {
          const user = response;
          if(user){
            localStorage.setItem('token', user.token);
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            sessionStorage.setItem('userName', this.decodedToken.unique_name);
          }
        })
      )
  }

  register(model: any){
    return this.http.post(`${this.baseURL}register`, model);
  }

  loggedIn(){
    const token =  localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token?.toString());
  }


}
