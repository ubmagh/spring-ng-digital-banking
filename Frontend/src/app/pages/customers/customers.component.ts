import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.sass']
})
export class CustomersComponent implements OnInit {

  customers !: Observable<Customer[]>;
  errorMessage :string ="";
  searchForm ?: FormGroup;

  constructor( 
    private titleService :Title,
    private customerService:CustomerService,
    private fb:FormBuilder
    ) { 

    titleService.setTitle("Ebank- Customers");
    this.searchForm = this.fb.group({
      keyword: this.fb.control( "" )
    })

  }

  ngOnInit(): void {
    
    this.customers = this.customerService.getCustomers().pipe(
      tap(()=>{ this.errorMessage=""; }),
      catchError(
        err=>{
          this.errorMessage = <string>err.message;
          return throwError( ()=> new Error(this.errorMessage));
        }
      )
    )

    // instead, can do next line :
    // this.handleSearchSubmit();
  
  }


  handleSearchSubmit(){
    let kw = <string>this.searchForm?.value.keyword;
    this.customers = this.customerService.searchCustomers( kw ).pipe(
      tap(()=>{ this.errorMessage=""; }),
      catchError(
        err=>{
          this.errorMessage = <string>err.message;
          return throwError( ()=> new Error(this.errorMessage));
        }
      )
    )
  }



}
