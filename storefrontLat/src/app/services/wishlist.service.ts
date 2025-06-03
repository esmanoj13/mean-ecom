import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../types/data-types';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor() {}
  http = inject(HttpClient);
  private $apiURL = environment.API_URL;
  public wishlistSignal = signal<Product[]>([]);
  loadWishlist(): void {
    this.http
      .get<Product[]>(`${this.$apiURL}/customer/wishlist`)
      .subscribe((items) => {
        this.wishlistSignal.set(items);
      });
  }
  isInWishlist(id: string): boolean {
    return this.wishlistSignal().some((item) => item._id === id);
  }
  get wishlistItems() {
    return this.wishlistSignal.asReadonly();
  }

  toogleWishlist(product: Product): void {
    const isInList = this.wishlistSignal().some(
      (item) => item._id === product._id
    );
    if (!isInList) {
      this.http
        .post<Product>(`${this.$apiURL}/customer/wishlist/${product?._id}`, {})
        .subscribe({
          next: (added) => {
            this.wishlistSignal.update((items) => [...items, added]);
            this.loadWishlist();
          },
          error: (err) => {
            console.error('Error adding to wishlist:', err);
          },
        });
    } else {
      this.http
        .delete<Product>(`${this.$apiURL}/customer/wishlist/${product._id}`)
        .subscribe({
          next: () => {
            this.wishlistSignal.update((items) =>
              items.filter((item) => item._id !== product._id)
            );
            this.loadWishlist();
          },
          error: (err) => {
            console.error('Error removing from wishlist:', err);
          },
        });
      this.loadWishlist();
    }
  }
}
