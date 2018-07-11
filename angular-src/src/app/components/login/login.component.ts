import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, ToastyHelperService } from '../../core/services';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  email: string;
  password: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastyService: ToastyHelperService
  ) { }

  ngOnInit() {
    this.authSubscription = this.authService.userChanged.subscribe(user => {
      if (user) {
        this.toastyService.showSuccess(
          `Login successfully`,
          `You are now logged in`
        );

        this.router.navigateByUrl('/user');
      }
    }, error => {

    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  onLoginClick() {
    this.authService.login(this.email, this.password).subscribe();
  }
}
