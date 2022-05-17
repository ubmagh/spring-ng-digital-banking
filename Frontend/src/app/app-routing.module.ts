import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren: ()=>import("./pages/home/home.module").then(e=>e.HomeModule)
  },
  {
    path: "accounts",
    loadChildren: ()=>import("./pages/accounts/accounts.module").then(e=>e.AccountsModule)
  },
  {
    path: "customers",
    loadChildren: ()=>import("./pages/customers/customers.module").then(e=>e.CustomersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
