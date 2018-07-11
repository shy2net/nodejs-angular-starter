import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService, AuthService, ToastyHelperService } from '../../core/services';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  constructor(private router: Router,
    public appService: AppService,
    private toastyHelperService: ToastyHelperService,
    private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/');
      this.toastyHelperService.showSuccess(`You are logged out`, `You have succesfully logged out!`);
    });
  }
}
