import { AuthGuardService } from './../../guards/auth-guard.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  previousUrl;
  form: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authGuard: AuthGuardService,
    private authService: AuthService) {
    this.createForm();
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

  createForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value,
    };
    this.authService.login(user).subscribe((res:any) => {
      if (!res.success) {
        this.messageClass = 'alert alert-danger';
        this.message = res.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = res.message;
        this.authService.storeData(res.token, res.user);

        setTimeout(() => {
          if(this.previousUrl) {
            this.router.navigate([this.previousUrl]);
          } else {
            this.router.navigate(['/dashboard']);
          }

        },2000);
      }
    });
  }

}
