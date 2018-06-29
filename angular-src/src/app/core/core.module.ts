import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
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
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    CookieModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    ToastyModule.forRoot(),
    RouterModule,
    SharedModule
  ],
  declarations: [HeaderComponent, FooterComponent],
  providers: [
    HttpClient,
    ApiService,
    AuthService,
    AuthGuardService,
    AppService,
    ToastyHelperService
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SlimLoadingBarModule,
    ToastyModule
  ]
})
export class CoreModule {}
