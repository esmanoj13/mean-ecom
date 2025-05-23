import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../types/data-types';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor() {}

  http = inject(HttpClient);
  private $apiURL = environment.API_URL;

  getWishlitItems() {
    return this.http.get<Product[]>(`${this.$apiURL}/customer/wishlist`);
  }

  addToWishlist(id: string) {
    return this.http.post<Product>(
      `${this.$apiURL}/customer/wishlist/${id}`,
      {}
    );
  }

  removeFromWishlist(id: string) {
    return this.http.delete<Product>(`${this.$apiURL}/customer/wishlist/${id}`);
  }
}
