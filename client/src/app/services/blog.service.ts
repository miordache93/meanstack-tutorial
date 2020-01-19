import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  headers;
  authToken;
  domain ;

  constructor(private http: HttpClient, private authService: AuthService) { 
    this.domain = this.authService.domain;

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

  newBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.post(`${this.domain}/blogs/newBlog`, blog, {headers: this.headers});
  }

  getAllBlogs() {
    this.createAuthenticationHeaders();
    return this.http.get(`${this.domain}/blogs/allBlogs`, {headers: this.headers});
  }

  editBlog(blog) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(`${this.domain}/blogs/updateBlog/`, blog, {headers: this.headers});
  }

  getSingleBlog(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(`${this.domain}/blogs/singleBlog/${id}`, {headers: this.headers});
  }
}
