import { UserProfileModel } from './../../../../../shared/models/user-profile.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userProfile: UserProfileModel = new UserProfileModel();
  isFormValid: boolean;

  constructor(private apiService: ApiService, private toastyService: ToastrService, private router: Router) {}

  ngOnInit() {}

  onFormValidChange(isValid) {
    this.isFormValid = isValid;
  }

  onRegisterClick() {
    this.apiService.register(this.userProfile).subscribe(result => {
      this.toastyService.success(`User successfully registered! please login now`);
      this.router.navigateByUrl('/login');
    }, error => {});
  }
}
