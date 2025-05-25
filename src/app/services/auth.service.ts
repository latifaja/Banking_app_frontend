import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean = false;
  roles: any;
  username: any;
  accessToken!: any;

  constructor(private http: HttpClient, private router: Router) { }

  public login (username: string, password: string) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }
    let params = new HttpParams().set("username",username).set("password",password);
    return this.http.post(environment.backendHost + "/auth/login", params, options);
  }

 loadProfile(data: any) {
      this.isAuthenticated = true;

    this.accessToken = data['access-token'];
    let decodedJwt:any = jwtDecode(this.accessToken);
    this.username = decodedJwt.sub;
    this.roles = decodedJwt.scope;
    window.localStorage.setItem("jwt-token", this.accessToken);
    this.router.navigateByUrl("/admin/customers");

  }

  logout() {
    this.isAuthenticated = false;
    this.accessToken = undefined;
    this.roles = undefined;
    this.username = undefined;
    window.localStorage.removeItem('jwt-token');
    this.router.navigateByUrl('/login');
  }

  loadJwtTokenFromStorage() {
    let token = window.localStorage.getItem('jwt-token');
    if(token) {
      this.loadProfile({
        "access-token": token
      });
      this.router.navigateByUrl('/admin');
    }
  }
}