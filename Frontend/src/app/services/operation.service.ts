import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SecurityService } from './security.service';

@Injectable()
export class OperationService {

  constructor( private http:HttpClient, private securityService: SecurityService ) { }


  public debit( accountId:string, amount: number, description: string): Observable<any> {
    return this.http.post<any>(environment.backendUrl+"/api/operations/debit", {
      "accountId": accountId,
      "amount": amount,
      "description": description
    });
  }

  public credit( accountId:string, amount: number, description: string): Observable<any> {
    return this.http.post<any>(environment.backendUrl+"/api/operations/credit", {
      "accountId": accountId,
      "amount": amount,
      "description": description
    });
  }

  public transfert( accountSourceId:string, accountDestinationId:string, amount: number, description: string): Observable<any> {
    return this.http.post<any>(environment.backendUrl+"/api/operations/transfer", {
      "accountSourceId": accountSourceId,
      "accountDestinationId": accountDestinationId,
      "amount": amount,
      "description": description
    });
  }


}
