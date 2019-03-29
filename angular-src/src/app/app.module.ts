import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Route } from '@angular/router';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

import { HomeComponent } from './components/home/home.component';
import { ExamplePageComponent } from './components/example-page/example-page.component';
import { LoginComponent } from './components/login/login.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { AuthGuardService } from '@services';

const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'example',
    pathMatch: 'full',
    component: ExamplePageComponent
  },
  {
    path: 'user',
    component: UserPageComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    component: UserPageComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExamplePageComponent,
    LoginComponent,
    UserPageComponent
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    SharedModule,
    CoreModule,
    RouterModule.forRoot(routes, { enableTracing: false }),
    FormsModule
  ],
  providers: []
})
export class AppModule {}
