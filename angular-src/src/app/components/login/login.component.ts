import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services';
import { ToastrService } from 'ngx-toastr';
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
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    this.authSubscription = this.authService.userChanged.subscribe(user => {
      if (user) {
        this.toastService.success(
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
