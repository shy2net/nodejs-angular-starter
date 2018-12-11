import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CookieModule } from 'ngx-cookie';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  ApiService,
  AppService,
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
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right'
    }) ,
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
    SlimLoadingBarModule,
    ToastrModule,
    SocialLoginModule
  ]
})
export class CoreModule { }
