import { UserProfileModel } from './../../../../../shared/models/user-profile.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userProfile: UserProfileModel = new UserProfileModel();

  constructor() {}

  ngOnInit() {}
}
