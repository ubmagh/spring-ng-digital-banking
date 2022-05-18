import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, Subject, Subscription, tap, throwError } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customers-card',
  templateUrl: './customers-card.component.html',
  styleUrls: ['./customers-card.component.sass'],
})
export class CustomersCardComponent implements OnInit, OnDestroy {
  customers!: Observable<Customer[]>;
  errorMessage: string = '';
  searchForm?: FormGroup;
  selectedCustomerForm?: FormGroup;

  @Input("selectedCustomerSubject") selectedCustomerSubject !:Subject<string>; 
  selectedCustomerSubject$ ?: Subscription;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {
    
  }

  ngOnInit(): void {
    this.customers = this.customerService.getCustomers().pipe(
      tap(() => {
        this.errorMessage = '';
      }),
      catchError((err) => {
        this.errorMessage = <string>err.message;
        return throwError(() => new Error(this.errorMessage));
      })
    );

    this.searchForm = this.fb.group({
      keyword: this.fb.control(''),
    });
    this.selectedCustomerForm = this.fb.group({
      customerId: this.fb.control(''),
    });

    this.selectedCustomerSubject$ = this.selectedCustomerForm.valueChanges.subscribe({
      next: value=>{
        this.selectedCustomerSubject.next( value.customerId )
      }
    })

  }

  handleSearchSubmit() {
    let kw = <string>this.searchForm?.value.keyword;
    this.selectedCustomerForm?.reset();
    this.selectedCustomerForm?.setValue({ customerId: '' });
    this.customers = this.customerService.searchCustomers(kw).pipe(
      tap(() => {
        this.errorMessage = '';
      }),
      catchError((err) => {
        this.errorMessage = <string>err.message;
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }

  ngOnDestroy(): void {
    this.selectedCustomerSubject$?.unsubscribe();
  }
}
