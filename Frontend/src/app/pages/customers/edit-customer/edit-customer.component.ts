import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.sass']
})
export class EditCustomerComponent implements OnInit, OnDestroy {

  routerSubscription?: Subscription;
  costumerId: string = ""
  customer?: Customer;
  errorMessage = "";

  form !: FormGroup;

  constructor(
    private titleServ: Title,
    private activateRoute: ActivatedRoute,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {

    titleServ.setTitle("Ebank - edit customer")

  }

  ngOnInit(): void {
    this.routerSubscription = this.activateRoute.params.subscribe({
      next: (params) => {
        this.costumerId = <string>params['customerId']
        this.customerService.getCustomer(this.costumerId).subscribe({
          next: (customer) => {
            this.customer = customer;

            this.form = this.fb.group({
              id: this.fb.control(this.customer.id, [
                Validators.required
              ]),
              name: this.fb.control(this.customer.name, [
                Validators.required, Validators.minLength(6)
              ]),
              email: this.fb.control(this.customer.email, [
                Validators.required, Validators.email
              ])
            })
          },
          error: err => {
            this.errorMessage = err.message;
          }
        })
      },
      error: err => {
        this.errorMessage = err.message;
      }
    });

  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  handleCustomerUpdate(){
    let customer:Customer = <Customer>this.form.value;
    this.customerService.updateCustomer( this.costumerId, customer).subscribe( {
      next: data=>{
        this.toastr.success( '', 'Customer Updated successfully!', { closeButton: true, positionClass: "toast-top-center" });
        this.router.navigate(["/customers"]);
        this.form.reset();
      },
      error: err=>{
        this.toastr.error( '', 'Customer not updated, an error happened !', { closeButton: true, positionClass: "toast-top-center", });
      }
    });


  }

}
