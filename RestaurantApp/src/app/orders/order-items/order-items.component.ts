import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OrderItem } from 'src/app/shared/order-item.model';
import { ItemService } from 'src/app/shared/item.service';
import { Item } from 'src/app/shared/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: []
})
export class OrderItemsComponent implements OnInit {
  formData: OrderItem;
  itemList: Item[];
  isValid = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private orderService: OrderService) { }

    ngOnInit() {

      this.itemService.getItemList().subscribe((res) => {
        this.itemList = res as Item[];
      });

      console.log('order-items ngOninit  this.data.orderItemIndex : ', this.data.orderItemIndex);
      if (this.data.orderItemIndex == null) {
        this.formData = {
          _id: null, // '',
          OrderItemID: null,
          OrderID: this.data.OrderID,
          ItemID: 0,
          ItemName: '',
          Price: 0,
          Quantity: 0,
          Total: 0
        }
      } else {
        this.formData = Object.assign({}, this.orderService.orderItems[this.data.orderItemIndex]);
        console.log('order-items ngOninit  this.data.OrderID : ', this.formData.OrderID);
      }
    }

    updatePrice(ctrl) {
      if (ctrl.selectedIndex === 0) {
        this.formData.Price = 0;
        this.formData.ItemName = '';
        this.formData.OrderItemID = 0;
        this.data.OrderItemIndex = 0;
      } else {
        this.formData.Price = this.itemList[ctrl.selectedIndex - 1].Price;
        this.formData.ItemName = this.itemList[ctrl.selectedIndex - 1].Name;
        this.formData.OrderItemID = ctrl.selectedIndex;
        this.data.OrderItemIndex = ctrl.selectedIndex;
      }
      this.updateTotal();
    }

    updateTotal() {
      this.formData.Total = parseFloat((this.formData.Quantity * this.formData.Price).toFixed(2));
      // console.log('order-items updateTotal : ', this.formData);
    }

    onSubmit(form: NgForm) {
      if (this.validateForm(form.value)) {
        if (this.data.orderItemIndex == null) {
          this.orderService.orderItems.push(form.value);
        } else {
          this.orderService.orderItems[this.data.orderItemIndex] = form.value;
        }

        console.log('order-items onSubmit : ' + this.orderService.orderItems);
        this.dialogRef.close();
      }
    }

    validateForm(formData: OrderItem) {
      this.isValid = true;
      if (formData.ItemID === 0) {
        this.isValid = false;
      } else if (formData.Quantity === 0) {
        this.isValid = false;
      }
      return this.isValid;
    }

}
