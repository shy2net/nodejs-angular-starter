import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {
  constructor(public router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuthentication(route.data && route.data['roles']);
  }

  canLoad(route: Route) {
    return this.checkAuthentication(route.data && route.data['roles']);
  }

  checkAuthentication(roles?: string[]) {
    if (roles) {
      return this.authService.hasRolesAsync(roles);
    }

    return this.authService.isLoggedInAsync;
  }
}
