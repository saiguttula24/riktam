import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {ToastModule} from 'primeng/toast';
import { SharedModule } from './shared/shared.module';
import {PasswordModule} from 'primeng/password';
import { EffectsModule } from '@ngrx/effects';
import { UserReducer } from './store/reducer';
import { UserEffects } from './store/effects';
import { StoreModule } from '@ngrx/store';
import {MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VerifyComponent } from './verify/verify.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VerifyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastModule,
    PasswordModule,
    SharedModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ user: UserReducer}),
    EffectsModule.forRoot( [ UserEffects] )
  ],
  providers: [MessageService,DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
