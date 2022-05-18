import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerAccountResponse } from '../models/account.model';
import { Customer } from '../models/customer.model';

@Injectable()
export class CustomerService {

  constructor( private http:HttpClient) {

  }


  public getCustomers() : Observable<Customer[]> {
    return this.http.get<Customer[]>(environment.backendUrl+"/api/customers");
  }

  public searchCustomers( keyword :string) : Observable<Customer[]> {
    return this.http.get<Customer[]>(environment.backendUrl+"/api/customers/search",{
      params: { 
        keyword: keyword
      }
    });
  }

  public saveCustomer( customer :Customer): Observable<Customer> {
    return this.http.post<Customer>(environment.backendUrl+"/api/customers", customer);
  } 

  public deleteCustomer( customerid :string ){
    return this.http.delete(environment.backendUrl+"/api/customers/"+customerid );
  }

  public getCustomer( customerId:string) : Observable<Customer>{
    return this.http.get<Customer>(environment.backendUrl+"/api/customers/"+customerId );
  }

  public updateCustomer( customerId:string, customer:Customer) : Observable<Customer>{
    return this.http.put<Customer>(environment.backendUrl+"/api/customers/"+customerId, customer );
  }

  public getCustomerAccounts( customerId:string, page:number, size:number) :Observable<CustomerAccountResponse>{
    return this.http.get<CustomerAccountResponse>(environment.backendUrl+"/api/customers/"+customerId+"/accounts",{
      params: { 
        page : page-1,
        size
      }
    });
  }

}
