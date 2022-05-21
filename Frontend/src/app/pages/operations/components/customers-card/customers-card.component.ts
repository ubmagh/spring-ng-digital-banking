import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, Subject, Subscription, tap, throwError } from 'rxjs';
import { Customer, CustomersPaginated } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customers-card',
  templateUrl: './customers-card.component.html',
  styleUrls: ['./customers-card.component.sass'],
})
export class CustomersCardComponent implements OnInit, OnDestroy {
  customers!: Observable<CustomersPaginated>;
  errorMessage :string = '';
  searchForm ?:FormGroup;
  selectedCustomerForm ?:FormGroup;
  selectedCustomerName :string="";

  @Input("selectedCustomerSubject") selectedCustomerSubject !:Subject<string>; 
  selectedCustomerSubject$ ?: Subscription;

  page: number = 1;
  size: number = 10;
  nbrPages: number = 1;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {
    
  }

  ngOnInit(): void {
    
    this.getCustomers( this.page );

    this.searchForm = this.fb.group({
      keyword: this.fb.control(''),
    });
    this.selectedCustomerForm = this.fb.group({
      customerId: this.fb.control(''),
    });
    
    this.selectedCustomerSubject$ = this.selectedCustomerForm.valueChanges.subscribe({
      next: value=>{
        if( value.customerId )
        this.selectedCustomerSubject.next( value.customerId )
      }
    })

  }

  setSelectedCustomerName( customerName:string){
    this.selectedCustomerName = customerName;
  }
  
  getCustomers( page:number){
    if( this.searchForm?.value.keyword.length>0){
      this.page = page;
      this.handleSearchSubmit();
    }else 
    this.customers = this.customerService.getCustomersPaginated(page, this.size ).pipe(
      tap((e)=>{ 
        this.errorMessage="";
        this.nbrPages = e.totalPages;
        this.page = e.currentPage+1;
        this.size = e.pageSize;
      }),
      catchError(
        err=>{
          this.errorMessage = <string>err.message;
          return throwError( ()=> new Error(this.errorMessage));
        }
      )
    )
  }

  
  handleSearchSubmit(){
    let kw = <string>this.searchForm?.value.keyword;
    this.selectedCustomerForm?.reset();
    this.selectedCustomerForm?.setValue({ customerId: '' });
    this.customers = this.customerService.searchCustomersPaginated( kw, this.page, this.size ).pipe(
      tap((e)=>{ this.errorMessage="";
      this.nbrPages = e.totalPages;
      this.page = e.currentPage+1;
      this.size = e.pageSize;
     }),
      catchError(
        err=>{
          this.errorMessage = <string>err.message;
          return throwError( ()=> new Error(this.errorMessage));
        }
      )
    )
  }



  ngOnDestroy(): void {
    this.selectedCustomerSubject$?.unsubscribe();
  }

  range(currentPage: number, nbrPages: number) {
    let arr;
    if (nbrPages > 5) {
      arr = new Array(5);

      if (currentPage <= 2) {
        for (let i = 0; i < 5; i++) arr[i] = i;
      } else {
        let j = 0;
        if (currentPage >= nbrPages - 2) {
          for (let i = nbrPages - 5; i < nbrPages; i++) arr[j++] = i;
        } else {
          for (let i = currentPage - 2; i < currentPage + 3; i++) arr[j++] = i;
        }
      }
    } else {
      arr = new Array(nbrPages);
      for (let i = 0; i < nbrPages; i++) arr[i] = i;
    }

    return arr;
  }

  setSize(size: string) {
    this.size = +size;
    this.handleSearchSubmit();
  }

}
