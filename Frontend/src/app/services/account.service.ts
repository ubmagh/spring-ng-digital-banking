import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BankAccount } from '../models/account.model';

@Injectable()
export class AccountService {

  constructor( private http:HttpClient ) { }

  public saveCustomer( account :BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(environment.backendUrl+"/api/accounts", account);
  }
  
  public updateCustomer( accountId:string, account :BankAccount): Observable<BankAccount> {
    return this.http.put<BankAccount>(environment.backendUrl+"/api/accounts/"+accountId, account);
  }

}
