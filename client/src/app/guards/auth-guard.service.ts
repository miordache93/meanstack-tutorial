import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate,
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  redirectUrl;

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.authService.isTokenExpired()) {
      return true;
    } else {
      this.redirectUrl = state.url;
      this.router.navigate(['/login']);
      return false;
    }
  }
}
