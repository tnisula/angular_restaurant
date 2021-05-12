import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs';

import { OrderItem } from './order-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  orderItems: OrderItem[];
  readonly baseURL = 'http://localhost:3001/orderitems';

  constructor(private http: HttpClient) { }

  getOrderItemList() {
    console.log('getOrderItemList ----------');
    return this.http.get(this.baseURL);
  }

  postOrderItem(orditem: OrderItem) {
    console.log(orditem);
    return this.http.post(this.baseURL, orditem);
  }

  getOrderItemByID(id: string) {
    return this.http.get(this.baseURL + '/' + id);
  }

  putOrderItem(orditem: OrderItem) {
    console.log(orditem);
    return this.http.put(this.baseURL + `/${orditem._id}`, orditem);
  }

  deleteOrderItem(id: string) {
    console.log(id);
    return this.http.delete(this.baseURL + '/' + id);
  }
}
