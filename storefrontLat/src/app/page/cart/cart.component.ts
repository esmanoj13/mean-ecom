import { Component, inject, input, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../types/data-types';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  cartItems: CartItem[] = [];
  quantity: number = 1;

  ngOnInit(): void {
    this.cartService.loadcart();
  }
  // Get cart items
  getcartItems() {
    return this.cartService.cartItems();
  }
  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity = item.quantity - 1;
      this.cartService.updateCartItemQuantity(
        item.productId._id!,
        item.quantity
      );
    } else {
      // If quantity is 1, remove the item from the cart
      this.removeFromCart(item.productId._id!);
    }
  }
  increaseQuantity(item: CartItem) {
    item.quantity = item.quantity + 1;
    this.cartService.updateCartItemQuantity(item.productId._id!, item.quantity);
  }
  removeFromCart(id: string) {
    this.cartService.removeFromCart(id);
  }
  // getTotalItems(items: CartItem[]): number {
  //   return items.reduce((total, item) => total + item.quantity, 0);
  // }
  // Calculate total price
  getSubTotalPrice() {
    return this.cartService
      .cartItems()
      .reduce((total, item) => total + item.productId.price * item.quantity, 0);
  }
  getShipping() {
    return this.getSubTotalPrice() > 0 ? 10 : 0; // Example shipping cost
  }
  getTotalPrice(): number {
    return this.getSubTotalPrice() + this.getShipping();
  }
}
