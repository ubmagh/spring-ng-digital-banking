import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { BankAccount } from 'src/app/models/account.model';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-accounts-card',
  templateUrl: './accounts-card.component.html',
  styleUrls: ['./accounts-card.component.sass'],
})
export class AccountsCardComponent implements OnInit, OnDestroy {
  @Input('customerIdObs') customerIdObs!: Observable<string>;
  customerIdObs$?: Subscription;

  customerId: string = '';
  customer!: Customer;
  page: number = 1;
  size: number = 10;
  nbrPages: number = 1;
  accounts: BankAccount[] = [];

  errorMessage: string = '';

  constructor(private customerservice: CustomerService) {}

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

        this.customerservice
          .getCustomerAccounts(this.customerId, this.page, this.size)
          .pipe(
            tap((any) => {
              this.errorMessage = ''; // on success clear error state :/
            })
          )
          .subscribe({
            next: (response) => {
              this.accounts = response.accounts;
              this.page = response.currentPage;
              this.nbrPages = response.totalPages;
              this.size = response.pageSize;
            },
            error: (err) => {
              this.errorMessage = err.message;
              console.error(err.message);
            },
          });
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.error(err.message);
      },
    });
  }

  ngOnDestroy(): void {
    this.customerIdObs$?.unsubscribe();
  }
}
