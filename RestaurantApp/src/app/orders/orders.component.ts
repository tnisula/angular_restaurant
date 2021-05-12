import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';
import { Order } from '../shared/order.model';
import { OrderItemService } from 'src/app/shared/order-item.service';
import { OrderItem } from '../shared/order-item.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {
  orderList: Order[];
  orderItemList: OrderItem[];
  orderID: number;

  constructor( public service: OrderService, private orderItemService: OrderItemService,
               private router: Router) { }

  ngOnInit() {
    this.refreshList();
    this. refreshOrderItemList();
  }

  refreshList() {
    this.service.getOrderList().subscribe((res) => {
      this.orderList = res as Order[];
      console.log('Count of orders : ' + this.orderList.length);
    });
  }

  openForEdit(ord: Order) {
    console.log('openForEdit', ord);
    this.service.orderID = ord.OrderID;
    this.service.selectedOrder = ord;
    this.router.navigate(['/order/edit/' + ord._id]);
  }

  onOrderDelete(ord: Order) {
    if (confirm('Are you sure to delete this record? ' + ord._id)) {
      this.service.orderID = ord.OrderID;
      this.orderID = ord.OrderID;
      // console.log('Order ID : ', this.orderID);
      this.service.selectedOrder = ord;
      this.deleteOrderItemList();

      this.service.deleteOrder(ord._id).subscribe(res => {
        this.refreshList();
      // this.toastr.warning("Deleted Successfully", "Restaurent App.");
      });
    }
  }

  refreshOrderItemList() {
    this.orderItemService.getOrderItemList().subscribe((res) => {
      this.orderItemList = res as OrderItem[];
      this.service.orderItems = res as OrderItem[];
    });
  }

  deleteOrderItemList() {
    // tslint:disable-next-line:forin
    let ordItems: OrderItem[];
    ordItems = this.orderItemList.filter(item => item.OrderID === this.orderID);
    this.orderItemList = ordItems;
    this.service.orderItems = ordItems;
    // console.log('OrderItems : ', this.orderItemList);

    // tslint:disable-next-line:forin
    for (const item in this.orderItemList) {
      this.orderItemService.deleteOrderItem(this.orderItemList[item]._id).subscribe((res) => {
        console.log(this.orderItemList[item]._id + ' deleted');
      });
    }
  }
}
