import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs';

import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customers: Customer[];
  readonly baseURL = 'http://localhost:3001/customers';

  constructor(private http: HttpClient) { }

  getCustomerList() {
    return this.http.get(this.baseURL);
  }

}
