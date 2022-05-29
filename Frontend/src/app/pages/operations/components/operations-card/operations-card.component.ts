import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription, tap } from 'rxjs';
import { BankAccount } from 'src/app/models/account.model';
import { Operation } from 'src/app/models/operation.model';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OperationService } from 'src/app/services/operation.service';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-operations-card',
  templateUrl: './operations-card.component.html',
  styleUrls: ['./operations-card.component.sass'],
})
export class OperationsCardComponent implements OnInit, OnDestroy {
  @Input('AccountIdObs') AccountIdObs!: Observable<string>;
  AccountIdSub$?: Subscription;
  accountId: string = '';
  acount?: BankAccount;
  errorMessage: string = '';
  page: number = 1;
  size: number = 10;
  nbrPages: number = 1;
  operations: Operation[] = [];

  operationType: string = 'debit';

  createForm!: FormGroup;
  submitting = false;
  selectedCustomerId: Subject<string> = new Subject<string>();
  selectedAccountId: Subject<string> = new Subject<string>();
  selectedAccountSub$?: Subscription;

  isAdmin = false;
  securityServicSub$?: Subscription;

  constructor(
    private customerservice: CustomerService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private accountService: AccountService,
    private securityService: SecurityService,
    private operationService: OperationService
  ) {
    this.securityServicSub$ = this.securityService.userSubject.subscribe({
      next: (user) => {
        this.isAdmin =
          user?.roles.find((e) => e.roleName == 'ADMIN') != undefined;
      },
      error: (err) => {
        this.isAdmin = false;
      },
    });
    this.createForm = this.fb.group({
      amount: this.fb.control('', [Validators.required, Validators.min(1)]),
      description: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
    });
  }

  ngOnInit(): void {
    this.isAdmin =
      this.securityService.user?.roles.find((e) => e.roleName == 'ADMIN') !=
      undefined;
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
    this.accountService
      .getAccountOperationsPaginated(this.accountId, page, this.size)
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
    this.securityServicSub$?.unsubscribe();
    this.selectedAccountSub$?.unsubscribe();
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

  setSelectedOpType(newType: string) {
    if (newType == 'debit' || newType == 'credit') {
      this.selectedAccountSub$?.unsubscribe();
      this.createForm = this.fb.group({
        amount: this.fb.control('', [Validators.required, Validators.min(1)]),
        description: this.fb.control('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      });
    } else {
      this.createForm = this.fb.group({
        amount: this.fb.control('', [Validators.required, Validators.min(1)]),
        description: this.fb.control('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
        detinationAccountId: this.fb.control('', [Validators.required]),
      });

      this.selectedAccountSub$ = this.selectedAccountId.subscribe({
        next: (accountId) => {
          this.createForm.setValue({
            amount: this.createForm.value?.amount,
            description: this.createForm.value?.description,
            detinationAccountId: accountId,
          });
        },
      });
    }
    this.operationType = newType;
  }

  handleCreateFormSubmit() {
    this.submitting = true;

    if (this.operationType == 'debit') {
      this.operationService
        .debit(
          this.accountId,
          +this.createForm.value.amount,
          this.createForm.value.description
        )
        .subscribe({
          next: (any) => {
            this.toastr.success('', 'Debit Operation saved successfully!', {
              closeButton: true,
              positionClass: 'toast-top-center',
            });
            this.createForm.reset();
            this.operationType = 'debit';
            this.submitting = false;
            document.getElementById('closeModal22')?.click();
            this.getOperations(this.page);
          },
          error: (err) => {
            this.toastr.error(
              '',
              'Operation could not be saved, balance unsufficient or maybe an error happened !',
              { closeButton: true, positionClass: 'toast-top-center' }
            );
            this.submitting = false;
          },
        });
    } else if (this.operationType == 'credit') {
      this.operationService
        .credit(
          this.accountId,
          +this.createForm.value.amount,
          this.createForm.value.description
        )
        .subscribe({
          next: (any) => {
            this.toastr.success('', 'Credit Operation saved successfully!', {
              closeButton: true,
              positionClass: 'toast-top-center',
            });
            this.createForm.reset();
            this.operationType = 'debit';
            this.submitting = false;
            document.getElementById('closeModal22')?.click();
            this.getOperations(this.page);
          },
          error: (err) => {
            this.toastr.error(
              '',
              'Operation could not be saved, an error happened !',
              { closeButton: true, positionClass: 'toast-top-center' }
            );
            this.submitting = false;
          },
        });
    } else if (this.operationType == 'transfert') {
      this.operationService
        .transfert(
          this.accountId,
          this.createForm.value.detinationAccountId,
          +this.createForm.value.amount,
          this.createForm.value.description
        )
        .subscribe({
          next: (any) => {
            this.toastr.success(
              '',
              'Operation of transfer saved successfully!',
              { closeButton: true, positionClass: 'toast-top-center' }
            );
            this.createForm.reset();
            this.operationType = 'debit';
            this.submitting = false;
            document.getElementById('closeModal22')?.click();
            this.getOperations(this.page);
          },
          error: (err) => {
            this.toastr.error(
              '',
              'Operation could not be saved, balance unsufficient or maybe an error happened !',
              { closeButton: true, positionClass: 'toast-top-center' }
            );
            this.submitting = false;
          },
        });
    }
  }
}
