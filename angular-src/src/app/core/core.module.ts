import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ToastyModule } from 'ng2-toasty';
import { CookieModule } from 'ngx-cookie';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import {
  HttpClient,
  ApiService,
  AppService,
  ToastyHelperService
} from './services';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    CookieModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    ToastyModule.forRoot(),
    SharedModule
  ],
  declarations: [],
  providers: [
    HttpClient,
    ApiService,
    AppService,
    ToastyHelperService
  ]
})
export class CoreModule { }
