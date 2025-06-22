import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/data-types';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatIcon,
    MatFormFieldModule,
    RouterLink,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  selected = 'pending';
  ngOnInit(): void {
    this.getorders();
  }
  orderService = inject(OrderService);
  orders: Order[] = [];
  getorders() {
    this.orderService.getCustomerOrder().subscribe({
      next: (data: any) => {
        this.orders = data;
        console.log(data);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
