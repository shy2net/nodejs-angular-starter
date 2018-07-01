import { AuthService, ToastyHelperService } from './../../core/services';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastyService: ToastyHelperService
  ) { }

  ngOnInit() { }

  onLoginClick() {
    this.authService.login(this.username, this.password).subscribe(
      result => {
        this.toastyService.showSuccess(
          `Login successfully`,
          `You are now logged in`
        );

        this.router.navigateByUrl('/user');
      },
      error => { }
    );
  }
}
