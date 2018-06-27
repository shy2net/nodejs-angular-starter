import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {
  constructor(public router: Router, private authService: AuthService) {}

  canActivate() {
    return this.authService.isLoggedInAsync;
  }

  canLoad() {
    return this.authService.isLoggedInAsync;
  }
}
