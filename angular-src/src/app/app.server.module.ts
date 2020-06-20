import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    // NoopAnimationsModule,
    // ServerTransferStateModule // comment
  ],
  providers: [
    // Add server-only providers here.
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
