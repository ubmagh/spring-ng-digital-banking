import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, Subscription, tap, throwError } from 'rxjs';
import { Customer, CustomersPaginated } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { MDCDialog } from '@material/dialog';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.sass']
})
export class CustomersComponent implements OnInit, OnDestroy {

  customers !: Observable<CustomersPaginated>;
  errorMessage :string ="";
  searchForm ?: FormGroup;
  userSub$ ?: Subscription

  page: number = 1;
  size: number = 10;
  nbrPages: number = 1;

  userIsAdmin=false;

  constructor( 
    private titleService :Title,
    private customerService:CustomerService,
    private fb:FormBuilder,
    private toastrService: ToastrService,
    private securityService: SecurityService
    ) { 

    titleService.setTitle("Ebank- Customers");
    this.searchForm = this.fb.group({
      keyword: this.fb.control( "" )
    })

    this.userIsAdmin = securityService.user?.roles.find(e=>e.roleName=='ADMIN')!=undefined;
    this.userSub$ = this.securityService.userSubject.subscribe({
      next: user=>{
        this.userIsAdmin = user?.roles.find(e=>e.roleName=='ADMIN')!=undefined;
      }
    })
  }

  ngOnInit(): void {
    
    this.getCustomers(this.page);

    // instead, can do next line :
    // this.handleSearchSubmit();
    this.userIsAdmin = this.securityService.user?.roles.find(e=>e.roleName=='ADMIN')!=undefined;
    
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

  handleDeleteCustomer( customer:Customer){

    const dialog = new MDCDialog(document.querySelector('.mdc-dialog')!);
    
    dialog.open();

    dialog.listen('MDCDialog:closed', (e:any)=>{
      if(e.detail.action=="delete"){

        this.customerService.deleteCustomer(customer.id).subscribe({
          next: any=>{
            this.toastrService.success("","Customer deleted successfully !", { closeButton: true, positionClass: "toast-top-center", })
            // this.handleSearchSubmit();
            // instead of loading data again, we can simply let the the browser do the work !
            this.customers = this.customers.pipe(
              map(data=>{
                let index = data.customers.indexOf(customer)
                data.customers.slice( index, 1);
                return data;
              })
            )
          },
          error: err=>{
            this.toastrService.error("","Can't delete customer, an error happened (console) !", { closeButton: true, positionClass: "toast-top-center", })
            console.error(err.message)
          }
        });


      }
    });

    
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

  ngOnDestroy(): void {
    this.userSub$?.unsubscribe();
  }
}
