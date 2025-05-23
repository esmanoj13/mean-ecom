import { Component, inject, input, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../types/data-types';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  cartItems: CartItem[] = [];

  ngOnInit(): void {
    this.getcartItems();
  }
  // Get cart items
  getcartItems() {
    this.cartService.getCartItems().subscribe((data) => {
      this.cartItems = data;
      console.log(this.cartItems);
    });
  }
  decreaseQuantity(item: CartItem) {}
  increaseQuantity(item: CartItem) {}
  removeFromCart(id: string) {}
  getTotalItems() {}
  getTotalPrice() {}
}
