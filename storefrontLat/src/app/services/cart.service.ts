import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { CartItem, Product } from '../types/data-types';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);
  private $apiURL = environment.API_URL;
  public cartSignal = signal<CartItem[]>([]);
  constructor() {}
  loadcart(): void {
    this.http
      .get<CartItem[]>(`${this.$apiURL}/customer/cart`)
      .subscribe((items) => {
        this.cartSignal.set(items);
      });
  }
  get cartItems() {
    return this.cartSignal.asReadonly();
  }
  isInCart(id: string): boolean {
    return this.cartSignal().some((item) => item.productId._id === id);
  }
  toggleCartItem(product: Product, quantity: number): void {
    const isInCart = this.cartSignal().some(
      (item) => item.productId._id === product._id
    );
    if (!isInCart) {
      this.http
        .post<CartItem>(`${this.$apiURL}/customer/cart/${product?._id}`, {
          quantity: quantity,
        })
        .subscribe({
          next: (added) => {
            this.cartSignal.update((items) => [...items, added]);
            this.loadcart();
          },
          error: (err) => {
            console.error('Error adding to cart:', err);
          },
        });
    } else {
      this.http
        .delete<CartItem>(`${this.$apiURL}/customer/cart/${product._id}`)
        .subscribe({
          next: () => {
            this.cartSignal.update((items) =>
              items.filter((item) => item.productId._id !== product._id)
            );
            this.loadcart();
          },
          error: (err) => {
            console.error('Error removing from cart:', err);
          },
        });
      this.loadcart();
    }
  }
  removeFromCart(id: string) {
    this.http
      .delete<CartItem>(`${this.$apiURL}/customer/cart/${id}`)
      .subscribe({
        next: () => {
          this.cartSignal.update((items) =>
            items.filter((item) => item.productId._id !== id)
          );
          this.loadcart();
        },
        error: (err) => {
          console.error('Error removing from cart:', err);
        },
      });
    this.loadcart();
  }
  // Update the quantity of an item in the cart
  updateCartItemQuantity(id: string, quantity: number) {
    this.http
      .put<CartItem>(`${this.$apiURL}/customer/cart/${id}`, {
        quantity: quantity,
      })
      .subscribe({
        next: () => {
          this.cartSignal.update((items) =>
            items.map((item) =>
              item.productId._id === id ? { ...item, quantity: quantity } : item
            )
          );
        },
        error: (err) => {
          console.error('Error removing from cart:', err);
        },
      });
  }
}
