import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastyModule } from 'ng2-toasty';
import { CookieModule } from 'ngx-cookie';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import {
  ApiService,
  AppService,
  ToastyHelperService,
  RequestsService
} from './services';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { AppHttpInterceptor } from './app-http.interceptor';
import { SocialLoginModule } from '../social-login/social-login.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    CookieModule.forRoot(),
    ToastyModule.forRoot(),
    LoadingBarModule.forRoot(),
    RouterModule,
    SharedModule,
    SocialLoginModule
  ],
  declarations: [HeaderComponent, FooterComponent],
  providers: [
    ApiService,
    AuthService,
    AuthGuardService,
    AppService,
    ToastyHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    },
    RequestsService
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ToastyModule,
    SocialLoginModule,
    LoadingBarModule
  ]
})
export class CoreModule { }
