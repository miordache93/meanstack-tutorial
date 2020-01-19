import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest,  } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken;
  user;
  headers;
  domain = 'http://localhost:8080';


  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  registerUser(user) {
    return this.http.post(`${this.domain}/authentication/register`, user);
  }

  checkUsername(username) {
    return this.http.get(`${this.domain}/authentication/checkUsername/${username}`);
  }

  checkEmail(email) {
    return this.http.get(`${this.domain}/authentication/checkEmail/${email}`);
  }

  login(user) {
    return this.http.post(`${this.domain}/authentication/login`, user);
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  createAuthenticationHeaders() {
    this.loadToken();
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': this.authToken
    });
  }

  loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get(`${this.domain}/authentication/profile`, {headers: this.headers});
  }

  isTokenExpired() {
    console.log(this.jwtHelper.isTokenExpired());
    return this.jwtHelper.isTokenExpired();
  }
}
