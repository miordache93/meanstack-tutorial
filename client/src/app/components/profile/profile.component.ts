import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  username;
  email;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe((res:any) => {
     this.username = res.user.username;
     this.email = res.user.email;
    });
  }

}
