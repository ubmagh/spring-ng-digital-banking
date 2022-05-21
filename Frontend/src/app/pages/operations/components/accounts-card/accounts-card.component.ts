import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription, tap } from 'rxjs';
import { BankAccount } from 'src/app/models/account.model';
import { Customer } from 'src/app/models/customer.model';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-accounts-card',
  templateUrl: './accounts-card.component.html',
  styleUrls: ['./accounts-card.component.sass'],
})
export class AccountsCardComponent implements OnInit, OnDestroy {

  @Input('customerIdObs') customerIdObs!: Observable<string>;
  @Input("selectedAccount") selectedAccount !: Subject<string>;

  customerIdObs$?: Subscription;

  customerId: string = '';
  customer!: Customer;
  page: number = 1;
  size: number = 10;
  nbrPages: number = 1;
  accounts: BankAccount[] = [];

  errorMessage: string = '';
 
  selectedAccountForm ?:FormGroup;
  selectedAccountSub$ ?:Subscription;

  constructor(
    private customerservice: CustomerService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private accountService:AccountService
  ) {
    
  }

 

  ngOnInit(): void {
    this.customerIdObs$ = this.customerIdObs.subscribe({
      next: (customerId) => {
        this.customerId = customerId;

        this.customerservice.getCustomer(customerId).subscribe({
          next: (customer) => {
            this.customer = <Customer>customer;
          },
          error: (err) => {
            this.errorMessage = err.message;
            console.error(err.message);
          },
        });

        this.getAccounts(1);
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.error(err.message);
      },
    });

    this.selectedAccountForm = this.fb.group({
      accountId: this.fb.control(''), 
    });

    this.selectedAccountSub$ = this.selectedAccountForm.valueChanges.subscribe({
      next: value=>{
        this.selectedAccount.next( value.accountId )
      }
    })

  }
  
  
  ngOnDestroy(): void {
    this.customerIdObs$?.unsubscribe();
  }

  getAccounts(page: number) {
    this.customerservice
      .getCustomerAccounts(this.customerId, page, this.size)
      .pipe(
        tap((any) => {
          this.errorMessage = ''; // on success clear error state :/
        })
      )
      .subscribe({
        next: (response) => {
          this.accounts = response.accounts;
          this.page = response.currentPage + 1;
          this.nbrPages = response.totalPages;
          this.size = response.pageSize;
        },
        error: (err) => {
          this.errorMessage = err.message;
          console.error(err.message);
        },
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
    this.getAccounts(this.page);
  }
}
