import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription, tap } from 'rxjs';
import { BankAccount } from 'src/app/models/account.model';
import { Customer } from 'src/app/models/customer.model';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { SecurityService } from 'src/app/services/security.service';

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
  selectedType: string = 'SavingAccount';

  createForm!: FormGroup;
  submitting =false;

  editForm !:FormGroup;
  edittedAccount ?:BankAccount; 
  editFormSelectedType:string="SavingAccount";

  deletedAccount ?:BankAccount;

  isAdmin = false;
  securityServicSub$ ?: Subscription;

  constructor(
    private customerservice: CustomerService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private accountService:AccountService,
    private securityService:SecurityService
  ) {
    this.onSavingAccountSelected();
    this.editForm = this.fb.group({
      status: this.fb.control(''), // intial value
      interestRate: this.fb.control('', [
        Validators.required
      ])
    });

    this.securityServicSub$ = this.securityService.userSubject.subscribe({
      next: user=>{
        this.isAdmin = user?.roles.find(e=>e.roleName=="ADMIN")!=undefined;
      }, 
      error: err=>{
        this.isAdmin = false;
      }
    })
  }

  onCurrentAccountSelected() {
    this.selectedType = 'CurrentAccount';
    this.createForm = this.fb.group({
      type: this.fb.control('CurrentAccount'), // intial value
      balance: this.fb.control('', [
        Validators.required
      ]),
      overDraft: this.fb.control(0, [
        Validators.required,
      ]),
    });
  }

  onSavingAccountSelected() {
    this.selectedType = 'SavingAccount';
    this.createForm = this.fb.group({
      type: this.fb.control('SavingAccount'), // intial value
      balance: this.fb.control('',[
        Validators.required
      ]),
      interestRate: this.fb.control(0, [
        Validators.min(0),
        Validators.max(100),
        Validators.required,
      ]),
    });
  }

  handleCreateFormSubmit() {
    this.submitting = true;
    let ba : BankAccount = {
      createdAt: new Date(),
      balance: this.createForm.value.balance,
      customer: this.customer,
      id: "-",
      status: "CREATED",
      type: this.selectedType,
      interestRate: this.createForm.value?.interestRate,
      overDraft: this.createForm.value.overDraft
    }
    this.accountService.saveAccount( ba).subscribe({
      next: sa=>{
        this.toastr.success( '', 'Account created successfully!', { closeButton: true, positionClass: "toast-top-center" });
        this.createForm.reset();
        this.selectedType ="SavingAccount"
        this.submitting=false;
        document.getElementById("closeModal")?.click();
        this.getAccounts(this.page);
      },
      error: err=>{
        this.toastr.error( '', 'Account could not be saved, an error happened !', { closeButton: true, positionClass: "toast-top-center", });
        this.submitting=false;
      }
    })
  } 

  ngOnInit(): void {
    this.isAdmin = this.securityService.user?.roles.find(e=>e.roleName=="ADMIN")!=undefined;


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
  }

  openEditModal( account:BankAccount){
    if( account.type=="SavingAccount" ){
      this.editForm = this.fb.group({
        status: this.fb.control(account.status), // intial value
        interestRate: this.fb.control(account.interestRate, [
          Validators.required
        ])
      });
    }else{
      this.editForm = this.fb.group({
        status: this.fb.control(account.status), // intial value
        overDraft: this.fb.control(account.overDraft, [
          Validators.required
        ])
      });
    }
    this.editFormSelectedType = account.type;
    this.edittedAccount = account;
    document.getElementById('toggleEditModalBtn')?.click();
  }
  
  handleditFormSubmit(){
    this.submitting = true;
    let ba:BankAccount = {
      createdAt: new Date(),
      balance: this.edittedAccount!.balance,
      customer: this.customer,
      id: this.edittedAccount!.id,
      status: this.editForm.value.status,
      type: this.editFormSelectedType,
      interestRate: this.editForm.value?.interestRate,
      overDraft: this.editForm.value.overDraft
    }
    this.accountService.updateAccount( this.edittedAccount!.id, ba ).subscribe({
      next: sa=>{
        this.toastr.success( '', 'Account updated successfully!', { closeButton: true, positionClass: "toast-top-center" });
        this.createForm.reset();
        this.editFormSelectedType ="SavingAccount"
        this.submitting=false;
        document.getElementById("closeModal2")?.click();
        this.getAccounts(this.page);
      },
      error: err=>{
        this.toastr.error( '', 'Account could not be updated, an error happened !', { closeButton: true, positionClass: "toast-top-center", });
        console.error(err.message)
        this.submitting=false;
      }
    })
  }

  confirmDelete( account:BankAccount){
    this.deletedAccount = account;
    document.getElementById("toggleDeleteModalBtn")?.click();
  }

  handldeleteFormSubmit(){
    this.submitting =true;
    this.accountService.deleteAccount(this.deletedAccount!.id).subscribe({
      next: any=>{
        this.toastr.success( '', 'Account deleted successfully!', { closeButton: true, positionClass: "toast-top-center" });
        this.submitting=false;
        this.getAccounts(this.page);
        document.getElementById('closeModal3')?.click();
      },
      error: err=>{
        this.toastr.error( '', 'Account could not be deleted, an error happened (check your console) !', { closeButton: true, positionClass: "toast-top-center", });
        this.submitting=false;
        document.getElementById('closeModal3')?.click();
        console.error(err.message)
      }
    })
  }

  ngOnDestroy(): void {
    this.securityServicSub$?.unsubscribe();
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
