import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {
  constructor(public router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuthentication(route.data['roles']);
  }

  canLoad(route: Route) {
    return this.checkAuthentication(route.data['roles']);
  }

  checkAuthentication(roles?: string[]) {
    if (roles) {
      return this.authService.hasRolesAsync(roles);
    }

    return this.authService.isLoggedInAsync;
  }
}
