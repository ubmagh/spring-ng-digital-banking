import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, tap } from 'rxjs';
import { BankAccount } from 'src/app/models/account.model';
import { Operation } from 'src/app/models/operation.model';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-operations-card',
  templateUrl: './operations-card.component.html',
  styleUrls: ['./operations-card.component.sass']
})
export class OperationsCardComponent implements OnInit, OnDestroy {

  @Input("AccountIdObs") AccountIdObs !: Observable<string>;
  AccountIdSub$ ?:Subscription;
  accountId :string="";
  acount ?:BankAccount;
  errorMessage :string="";
  page: number = 1;
  size: number = 10;
  nbrPages: number = 1;
  operations: Operation[] = [];



  constructor(
    private customerservice: CustomerService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private accountService:AccountService
  ) { }

  ngOnInit(): void {
    this.AccountIdSub$ = this.AccountIdObs.subscribe({
      next: (accountId) => {
        this.accountId = accountId;

        this.accountService.getAccount(accountId).subscribe({
          next: (acount) => {
            this.acount = <BankAccount>acount;
          },
          error: (err) => {
            this.errorMessage = err.message;
            console.error(err.message);
          },
        });

        this.getOperations(1);
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.error(err.message);
      },
    });
  }

  getOperations(page: number) {
    this.accountService.getAccountOperationsPaginated(this.accountId, page, this.size)
      .pipe(
        tap((any) => {
          this.errorMessage = ''; // on success clear error state :/
        })
      )
      .subscribe({
        next: (response) => {
          this.operations = response.accountOperationDTOS;
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

  ngOnDestroy(): void {
    this.AccountIdSub$?.unsubscribe();
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
    this.getOperations(this.page);
  }

  openEditModal( operation:Operation){
    /*
    if( operation.type=="SavingAccount" ){
      this.editForm = this.fb.group({
        status: this.fb.control(operation.status), // intial value
        interestRate: this.fb.control(operation.interestRate, [
          Validators.required
        ])
      });
    }else{
      this.editForm = this.fb.group({
        status: this.fb.control(operation.status), // intial value
        overDraft: this.fb.control(operation.overDraft, [
          Validators.required
        ])
      });
    }
    this.editFormSelectedType = operation.type;
    this.edittedAccount = operation;
    document.getElementById('toggleEditModalBtn')?.click();
    */
  }

  confirmDelete( operation:Operation ){
    /*
    this.deletedAccount = account;
    document.getElementById("toggleDeleteModalBtn")?.click();
    */
  }



}
