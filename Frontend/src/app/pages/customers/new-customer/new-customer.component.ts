import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';


@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.sass']
})
export class NewCustomerComponent implements OnInit {

  form !: FormGroup;
  success_toast :any;
  submitting=false;

  constructor( private fb: FormBuilder, 
    private customerService: CustomerService,
    private toastr: ToastrService) {

    this.form = this.fb.group({
      name: this.fb.control("", [
        Validators.required, Validators.minLength(6)
      ]),
      email: this.fb.control("", [
        Validators.required, Validators.email
      ])
    })

  }

  ngOnInit(): void {

    
  }

  handleCustomerCreate(){
    this.submitting=true;
    let customer:Customer = {
      id:"",
      name: this.form.value.name,
      email: this.form.value.email
    }
    this.customerService.saveCustomer( customer).subscribe( {
      next: data=>{
        this.toastr.success( '', 'Customer added successfully!', { closeButton: true, positionClass: "toast-top-center" });
        this.form.reset();
        this.submitting=false;
      },
      error: err=>{
        this.toastr.error( '', 'Customer not saved, an error happened !', { closeButton: true, positionClass: "toast-top-center", });
        this.submitting=false;
      }
    });
  }

}
