import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationsRoutingModule } from './operations-routing.module';
import { OperationsComponent } from './operations.component';
import { CustomerService } from 'src/app/services/customer.service';
import { AccountService } from 'src/app/services/account.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomersCardComponent } from './components/customers-card/customers-card.component';
import { AccountsCardComponent } from './components/accounts-card/accounts-card.component';
import { OperationsCardComponent } from './components/operations-card/operations-card.component';
import { OperationService } from 'src/app/services/operation.service';
import { TokenInterceptorProvider } from 'src/app/interceptors/tokenInterceptor';


@NgModule({
  declarations: [
    OperationsComponent,
    CustomersCardComponent,
    AccountsCardComponent,
    OperationsCardComponent
  ],
  imports: [
    CommonModule,
    OperationsRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers:[
    CustomerService,
    AccountService,
    OperationService,
    TokenInterceptorProvider
  ]
})
export class OperationsModule { }
