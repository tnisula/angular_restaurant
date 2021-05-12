import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';
import { Customer } from 'src/app/shared/customer.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { CustomerService } from 'src/app/shared/customer.service';
import { Order } from 'src/app/shared/order.model';
import { OrderItem } from 'src/app/shared/order-item.model';
import { OrderItemService } from 'src/app/shared/order-item.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {
  customerList: Customer[];
  orderList: Order[];
  orderItemList: OrderItem[];
  deletedOrderItems: string[];
  isValid = true;
  orderCount: number;

  constructor(public service: OrderService, private orderItemService: OrderItemService,
              private dialog: MatDialog,
              private customerService: CustomerService, private router: Router,
              private currentRoute: ActivatedRoute ) { }

  ngOnInit() {
    const orderID = this.currentRoute.snapshot.paramMap.get('id');
    // console.log('order ngOnInit orderID : ', ordID);

    this.refreshCustomerList();

    if (orderID == null) {
      this.refreshOrderList();
      this.resetForm();
      this.service.formData.OrderID = this.orderCount;
    } else {
        this.service.getOrderByID(orderID).subscribe((res) => {
          this.service.formData = res as Order;
          this.service.selectedOrder = res as Order;
        });

        this.orderItemService.getOrderItemList().subscribe((res) => {
          this.orderItemList = res as OrderItem[];
          this.service.orderItems = this.orderItemList.filter(item  => item.OrderID === this.service.selectedOrder.OrderID);
          this.orderItemList = this.service.orderItems;
          // console.log('OrderItems : ', this.orderItemList);
        });
      }

    // this.refreshCustomerList();
    this.deletedOrderItems = [];
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
    }
    this.service.formData = {
      _id: '',
      OrderID: null,
      OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      CustomerID: 0,
      PMethod: '',
      GTotal: 0,
      DeletedOrderItemIDs: ''
    };
    this.service.selectedOrder = this.service.formData;
    this.service.orderItems = [];
  }

  refreshCustomerList() {
    this.customerService.getCustomerList().subscribe((res) => {
      this.customerList = res as Customer[];
      // console.log(this.customerList);
    });
  }

  AddOrEditOrderItem(orderItemIndex, OrderID) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { orderItemIndex, OrderID };
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      // console.log('orderItemIndex, OrderID : ', orderItemIndex, OrderID);
      this.updateGrandTotal();
    });
  }

  onDeleteOrderItem(orderItemID: number, i: number) {
    if (orderItemID != null) {
      this.service.formData.DeletedOrderItemIDs += orderItemID + ',';
    }
    this.deletedOrderItems.push(this.service.orderItems[i]._id);
    this.service.orderItems.splice(i, 1);
    // console.log(this.deletedOrderItems);
    this.updateGrandTotal();
  }

  updateGrandTotal() {
    this.service.formData.GTotal = this.service.orderItems.reduce((prev, curr) => {
      return prev + curr.Total;
    }, 0);

    this.service.formData.GTotal = parseFloat(this.service.formData.GTotal.toFixed(2));
  }

  validateForm() {
    this.isValid = true;
    if (this.service.formData.CustomerID === 0) {
      this.isValid = false;
    } else if (this.service.orderItems.length === 0) {
      this.isValid = false;
    }
    return this.isValid;
  }

/*
  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      this.service.saveOrUpdateOrder().subscribe(res => {
        this.resetForm();
        // this.toastr.success('Submitted Successfully', 'Restaurent App.');
        this.router.navigate(['/orders']);
      });

    }
    // this.resetForm();
    // this.router.navigate(['/orders']);
  }
*/

  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      if (form.value._id === '') {
        console.log('order save onSubmit : ' + form.value.OrderID);
        this.service.postOrder(form.value).subscribe((res) => {
          this.resetForm(form);
          this.refreshOrderList();
          this.refreshOrderItemList();
          this.router.navigate(['/orders']);
          // M.toast({ html: 'Saved successfully', classes: 'rounded' });
        });
      } else {
        console.log('order update onSubmit : ' + form.value._id);
        this.service.putOrder(form.value).subscribe((res) => {
          this.resetForm(form);
          this.refreshOrderList();
          this.refreshOrderItemList();
          this.router.navigate(['/orders']);
          // M.toast({ html: 'Updated successfully', classes: 'rounded' });
        });
      }
      this.saveOrderItemList();
    }
  }

  refreshOrderList() {
    this.service.getOrderList().subscribe((res) => {
      this.service.orders = res as Order[];
      this.orderList = res as Order[];
      this.orderCount = this.orderList.length;
      this.service.formData.OrderID = this.orderCount;
      console.log('order count : ', this.orderCount);
    });
  }

  refreshOrderItemList() {
    this.orderItemService.getOrderItemList().subscribe((res) => {
      // this.orderItemList = res as OrderItem[];
      this.service.orderItems = res as OrderItem[];
    });
  }

  onEdit(ord: Order) {
    console.log('onEdit: ', ord);
    this.service.formData = ord;
  }

  saveOrderItemList() {
    this.service.orderItems.forEach((element, index) => {
      // console.log(`Current index: ${index} and element: ${element}`);

      if (this.service.orderItems[index]._id === null) {
        this.saveOrderItem(element);
        // console.log('save', element);
      } else {
        // console.log('update', element);
        this.updateOrderItem(element);
      }
    });

    if (this.deletedOrderItems !== null) {
      console.log('Something to be deleted!');
      this.deletedOrderItems.forEach( (item, index) => {
        console.log('index Item : ',  index + ' ' + item + ' ' + this.deletedOrderItems[index]);
        this.deleteOrderItem(this.deletedOrderItems[index]);
      });
    }
  }

  saveOrderItem(element: OrderItem) {
    this.orderItemService.postOrderItem(element).subscribe((res) => {
      // console.log(element);
    });
  }

  updateOrderItem(element: OrderItem) {
    this.orderItemService.putOrderItem(element).subscribe((res) => {
      // console.log(element);
    });
  }

  deleteOrderItem(id: string) {
    this.orderItemService.deleteOrderItem(id).subscribe((res) => {
      console.log(id + ' deleted!');
    });
  }
}
