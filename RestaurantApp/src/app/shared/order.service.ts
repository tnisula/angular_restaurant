import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  selectedOrder: Order;
  formData: Order;
  orders: Order[];
  orderItems: OrderItem[];
  orderID: number;
  readonly baseURL = 'http://localhost:3001/orders';

  constructor(private http: HttpClient) { }

  saveOrUpdateOrder() {

    const body = {
      ...this.formData,
      OrderItems: this.orderItems
    };

    // console.log('saveOrUpdateOrder : ', body);
    return this.http.post(this.baseURL, body);
  }

  postOrder(ord: Order) {
    // console.log(ord);
    console.log('postOrder orderitems : ', this.orderItems);
    return this.http.post(this.baseURL, ord);
  }

  getOrderList() {
    return this.http.get(this.baseURL);
  }

  getOrderByID(id: string) {
    return this.http.get(this.baseURL + '/' + id);
  }

  putOrder(ord: Order) {
    // console.log(ord);
    console.log('putOrder orderitems : ', this.orderItems);
    return this.http.put(this.baseURL + `/${ord._id}`, ord);
  }

  deleteOrder(id: string) {
    console.log(id);
    return this.http.delete(this.baseURL + '/' + id);
  }
}
