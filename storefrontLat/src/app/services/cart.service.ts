import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { CartItem, Product } from '../types/data-types';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);
  platformId = inject(PLATFORM_ID);
  private $apiURL = environment.API_URL;
  public cartSignal = signal<CartItem[]>([]);
  constructor() {}
  loadcart(): void {
    // This is used to check for universal angular,
    // Angular provides a way to check if code is running in the browser or server using isPlatformBrowser.
    if (!isPlatformBrowser(this.platformId)) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    this.http
      .get<CartItem[]>(`${this.$apiURL}/customer/cart`)
      .subscribe((items) => {
        this.cartSignal.set(items);
      });
  }
  // Getter function
  get cartItems() {
    return this.cartSignal.asReadonly();
  }
  isInCart(id: string): boolean {
    return this.cartSignal().some(
      (item) => item && item.productId && item.productId._id === id
    );
  }

  getTotal(): number {
    return this.cartSignal().reduce((total, item) => {
      const price = item.productId?.price || 0;
      const discount = item.productId?.discount || 0;
      const discountedPrice = price - (price * discount) / 100;
      return total + discountedPrice * item.quantity;
    }, 0);
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
