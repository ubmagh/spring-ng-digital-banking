import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerAccountResponse } from '../models/account.model';
import { Customer, CustomersPaginated } from '../models/customer.model';
import { SecurityService } from './security.service';

@Injectable()
export class CustomerService {

  
  constructor( private http:HttpClient, private securityService: SecurityService) {
  }


  public getCustomers() : Observable<Customer[]> {
    return this.http.get<Customer[]>(environment.backendUrl+"/api/customers");
  }

  public getCustomersPaginated( page :number, size :number) : Observable<CustomersPaginated> {
    return this.http.get<CustomersPaginated>(environment.backendUrl+"/api/customers/paginated",{
      params: { 
        page: page-1, size
      }
    });
  }

  public searchCustomers( keyword :string) : Observable<Customer[]> {
    return this.http.get<Customer[]>(environment.backendUrl+"/api/customers/search",{
      params: { 
        keyword: keyword
      }
    });
  }

  public searchCustomersPaginated( keyword :string, page:number, size:number) : Observable<CustomersPaginated> {
    return this.http.get<CustomersPaginated>(environment.backendUrl+"/api/customers/paginated/search",{
      params: { 
        keyword: keyword,
        page: page-1, size
      }
    });
  }
  

  public saveCustomer( customer :Customer): Observable<Customer> {
    return this.http.post<Customer>(environment.backendUrl+"/api/customers", customer);
  } 

  public deleteCustomer( customerid :string ){
    return this.http.delete(environment.backendUrl+"/api/customers/"+customerid);
  }

  public getCustomer( customerId:string) : Observable<Customer>{
    return this.http.get<Customer>(environment.backendUrl+"/api/customers/"+customerId);
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
