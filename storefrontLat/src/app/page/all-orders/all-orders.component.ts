import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Order, Product } from '../../types/data-types';
import { OrderService } from '../../services/order.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss',
})
export class AllOrdersComponent implements OnInit {
  selected = 'pending';
  allOrders: Order[] = [];
  ngOnInit(): void {
    this.getAllOrders();
  }

  productService = inject(ProductService);
  orderService = inject(OrderService);
  private router = inject(Router);
  getAllOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data: any) => {
        this.allOrders = data;
        console.log(data);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
  // getproductlist() {
  //   this.productService.getAllProducts().subscribe({
  //     next: (data) => {
  //       this.orders =
  //     },
  //     error: (err) => {},
  //   });
  // }
}
