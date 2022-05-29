import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BankAccount } from '../models/account.model';
import { Operation, OperationResponseObject } from '../models/operation.model';
import { SecurityService } from './security.service';

@Injectable()
export class AccountService {

  constructor( private http:HttpClient, private securityService: SecurityService ) { }

  public saveAccount( account :BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(environment.backendUrl+"/api/accounts", account);
  }
  
  public updateAccount( accountId:string, account :BankAccount): Observable<BankAccount> {
    return this.http.put<BankAccount>(environment.backendUrl+"/api/accounts/"+accountId, account);
  }

  public deleteAccount( accountId:string ) {
    return this.http.delete(environment.backendUrl+"/api/accounts/"+accountId);
  }

  public getAccount( accountId:string ): Observable<BankAccount> {
    return this.http.get<BankAccount>(environment.backendUrl+"/api/accounts/"+accountId);
  }


  public getAccountOperationsPaginated( accountId :string, page:number, size :number ): Observable<OperationResponseObject>{
    return this.http.get<OperationResponseObject>(environment.backendUrl+"/api/accounts/"+accountId+"/paginateOperations", {
      params:{
        page: page-1,
        size
      }
    })
  }

}
