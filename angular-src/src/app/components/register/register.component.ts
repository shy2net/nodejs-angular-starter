import { UserProfileModel } from './../../../../../shared/models/user-profile.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userProfile: UserProfileModel = new UserProfileModel();

  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  onRegisterClick() {
    this.apiService.register(this.userProfile).subscribe(result => {}, error => {});
  }
}
