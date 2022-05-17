import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';

const routes: Routes = [
  {
    path: "",
    component: CustomersComponent
  },
  {
    path: "new",
    component: NewCustomerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
