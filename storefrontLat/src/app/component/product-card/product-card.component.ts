import { Component, inject, input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../types/data-types';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  item = input.required<Product>();
  router = inject(Router);
  wishlist: Product[] = [];
  cartlist: Product[] = [];
  finalPrice: any;
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);

  ngOnInit(): void {
    this.getWishList();
    this.getCartList();
  }

  getWishList() {
    this.wishlistService.getWishlitItems().subscribe((data) => {
      this.wishlist = data;    
    });
  }

  getCartList() {
    this.cartService.getCartItems().subscribe((data) => {
      console.log('cart:', data);
    });
  }

  isInWishlist(item: Product): boolean {    
    if (this.wishlist) {
      return this.wishlist.some((w) => w._id === item._id);
    }
    return false;
  }

  productdisplay(id?: string) {
    console.log(id);
    this.router.navigate(['/product/' + id]);
  }

  isInCart(item: Product): boolean {
    return this.cartlist.some((w) => w._id === item._id);
  }

  // This is add the item to the wishlist
  addToWishlist(product: Product) {
    if (!this.isInWishlist(product)) {
      this.wishlistService.addToWishlist(product._id!).subscribe({
        next: () => this.getWishList(),
        error: (error) => console.error('Error adding to wishlist:', error),
      });
    } else {
      this.wishlistService.removeFromWishlist(product._id!).subscribe({
        next: () => this.getWishList(),
        error: (error) => console.error('Error removing from wishlist:', error),
      });
    }
  }

  // deleteFromWihlist(product: Product, event: Event) {
  //   event.stopPropagation();
  //   if (product._id) {
  //     this.wishlistService.removeToWishlist(product._id).subscribe(() => {
  //       // this.productdisplay(product._id);
  //       this.getWishList();
  //     });
  //     this.wishlist = this.wishlist.filter((w) => w._id !== product._id);
  //   }
  // }

  // This is add the item to the cart
  addToCart(product: Product) {
    if (!this.isInCart(product)) {
      this.cartService.addToCartItems(product._id!, 1).subscribe(() => {
        this.cartService.getCartItems();
      });
    } else {
      this.cartService.removeFromCart(product._id!).subscribe(() => {
        this.cartService.getCartItems();
      });
    }
  }
  // removeToCart(product: Product, event: Event) {
  //   event.stopPropagation();
  //   if (!this.fetchInCart(product._id)) {
  //     this.cartService.addToCartItems(product._id!, 1);
  //   } else {
  //     this.cartService.removeFromCart(product._id!);
  //   }
  // }
}
