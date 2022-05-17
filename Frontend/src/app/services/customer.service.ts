import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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

}
