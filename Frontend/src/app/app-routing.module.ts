import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './pages/error404/error404.component';
import { LoginComponent } from './pages/login/login.component';

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
  },
  {
    path: "operations",
    loadChildren: ()=>import("./pages/operations/operations.module").then(e=>e.OperationsModule)
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "**",
    component: Error404Component  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
