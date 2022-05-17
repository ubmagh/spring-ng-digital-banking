import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { MDCDialog } from '@material/dialog';

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
    private fb:FormBuilder,
    private toastrService: ToastrService
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
                let index = data.indexOf(customer)
                data.slice( index, 1);
                return data;
              })
            )
          },
          error: err=>{
            this.toastrService.error("","Can't delete customer, could still have an account !", { closeButton: true, positionClass: "toast-top-center", })
            console.error(err.message)
          }
        });


      }
    });

    
  }

}
