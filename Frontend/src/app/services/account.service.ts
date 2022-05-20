import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BankAccount } from '../models/account.model';

@Injectable()
export class AccountService {

  constructor( private http:HttpClient ) { }

  public saveAccount( account :BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(environment.backendUrl+"/api/accounts", account);
  }
  
  public updateAccount( accountId:string, account :BankAccount): Observable<BankAccount> {
    return this.http.put<BankAccount>(environment.backendUrl+"/api/accounts/"+accountId, account);
  }

  public deleteAccount( accountId:string ) {
    return this.http.delete(environment.backendUrl+"/api/accounts/"+accountId);
  }

}
