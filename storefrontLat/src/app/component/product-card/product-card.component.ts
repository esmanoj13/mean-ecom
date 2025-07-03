import { Component, inject, input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../types/data-types';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  environment = environment;
  item = input.required<Product>();
  router = inject(Router);
  wishlist: Product[] = [];
  cartlist: Product[] = [];
  finalPrice: any;
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  ngOnInit(): void {
    this.getWishList();
    // this.getCartList();
    this.wishlistService.loadWishlist();
    // Load cart items when the component initializes using signal
    this.cartService.loadcart();
  }
  // This is to get the wishlist details
  getWishList() {
    this.wishlistService.wishlistItems();
  }
  // This is to get the icon of the wishlist
  wishlistIcon(product: Product): boolean {
    if (!product._id) return false;
    return this.wishlistService.isInWishlist(product._id);
  }
  toggleWishlist(product: Product) {
    if (!this.authService.loggedIn) {
      this.router.navigate(['/login']);
      return;
    } else {
      this.wishlistService.toogleWishlist(product);
    }
  }
  // This is to get the cart details
  getCartList() {
    this.cartService.cartItems();
  }
  productdisplay(id?: string) {
    this.router.navigate(['/product/' + id]);
  }
  isInCart(item: Product): boolean {
    return this.cartlist.some((w) => w._id === item._id);
  }
  toggleCartItem(product: Product) {
    if (!this.authService.loggedIn) {
      this.router.navigate(['/login']);
      return;
    } else {
      this.cartService.toggleCartItem(product, 1);
    }
  }
}
