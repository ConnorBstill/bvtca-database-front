import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { RestService } from './services/rest.service';
import { AuthService } from './services/auth.service';
import { JWTService } from './services/jwt.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    RestService,
    AuthService,
    JWTService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
