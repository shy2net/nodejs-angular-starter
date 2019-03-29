import { AuthGuardService } from '@services';
import { AuthService } from '@services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CookieModule } from 'ngx-cookie';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import {
  ApiService,
  AppService,
  RequestsService
} from '@services';
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
    LoadingBarModule,
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
    LoadingBarModule,
    ToastrModule,
    SocialLoginModule
  ]
})
export class CoreModule { }
