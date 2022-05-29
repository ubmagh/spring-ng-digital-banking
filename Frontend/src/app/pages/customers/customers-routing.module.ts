import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuardGuard } from 'src/app/guards/admin-guard.guard';
import { CustomersComponent } from './customers.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';

const routes: Routes = [
  {
    path: "",
    component: CustomersComponent
  },
  {
    path: "new",
    component: NewCustomerComponent,
    canActivate: [ AdminGuardGuard]
  },
  {
    path: "edit/:customerId",
    component: EditCustomerComponent,
    canActivate: [ AdminGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
