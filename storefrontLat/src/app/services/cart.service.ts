import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { CartItem } from '../types/data-types';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);
  private $apiURL = environment.API_URL;
  constructor() {}
  getCartItems() {
    return this.http.get<CartItem[]>(`${this.$apiURL}/customer/cart`);
  }
  addToCartItems(id: string, quantity: number) {
    return this.http.post<CartItem>(`${this.$apiURL}/customer/cart/${id}`, {
      quantity: quantity,
    });
  }
  removeFromCart(id: string) {
    return this.http.delete<CartItem>(`${this.$apiURL}/customer/cart/${id}`);
  }
}
