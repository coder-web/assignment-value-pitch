import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
// for toastr
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfirmEqualValidatorDirective } from './_validators/confirm-equal-validator.directive';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    NavComponent,
    DashboardComponent,
    ConfirmEqualValidatorDirective
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    AppRoutingModule,
    NgxSpinnerModule,
    FormsModule, HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
