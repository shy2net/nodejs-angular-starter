import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastyModule } from 'ng2-toasty';
import { CookieModule } from 'ngx-cookie';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  ApiService,
  AppService,
  ToastyHelperService
} from './services';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { AppHttpInterceptor } from './app-http.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    CookieModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    ToastyModule.forRoot(),
    RouterModule,
    SharedModule
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
    }
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SlimLoadingBarModule,
    ToastyModule
  ]
})
export class CoreModule { }
