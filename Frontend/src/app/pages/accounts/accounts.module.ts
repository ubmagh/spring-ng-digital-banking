import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { CustomersCardComponent } from './components/customers-card/customers-card.component';
import { CustomerService } from 'src/app/services/customer.service';
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsCardComponent } from './components/accounts-card/accounts-card.component';
import { AccountService } from 'src/app/services/account.service';
import { TokenInterceptorProvider } from 'src/app/interceptors/tokenInterceptor';


@NgModule({
  declarations: [
    AccountsComponent,
    CustomersCardComponent,
    AccountsCardComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[
    CustomerService,
    AccountService,
    TokenInterceptorProvider
  ]
})
export class AccountsModule { }
