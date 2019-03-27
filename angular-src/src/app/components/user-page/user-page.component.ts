import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AppService, AuthService } from '../../core/services';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  constructor(private router: Router,
    public appService: AppService,
    private toastService: ToastrService,
    private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/');
      this.toastService.success(`You are logged out`, `You have succesfully logged out!`);
    });
  }
}
