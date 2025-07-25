import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../types/data-types';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor() {}
  private platformId = inject(PLATFORM_ID);
  http = inject(HttpClient);
  private $apiURL = environment.API_URL;
  // Using signal to manage wishlist state
  // This allows us to reactively update the wishlist in the UI
  // when items are added or removed.
  public wishlistSignal = signal<Product[]>([]);
  loadWishlist(): void {
    // This is used to check for universal angular,
    // Angular provides a way to check if code is running in the browser or server using isPlatformBrowser.
    if (!isPlatformBrowser(this.platformId)) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    this.http
      .get<Product[]>(`${this.$apiURL}/customer/wishlist`)
      .subscribe((items) => {
        this.wishlistSignal.set(items);
      });
  }
  // Check if a product is in the wishlist
  // This method checks if a product with the given ID is already in the wishlist.
  // It returns true if the product is found, otherwise false.
  // This is useful for determining whether to show the "Add to Wishlist" or "Remove from Wishlist" button.
  isInWishlist(id: string): boolean {
    return this.wishlistSignal().some((item) => item && item._id === id);
  }
  // Getter to access the wishlist items
  // This getter provides a read-only view of the wishlist items.
  // It allows components to subscribe to changes in the wishlist without directly modifying it.
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
