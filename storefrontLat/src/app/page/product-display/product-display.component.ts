import { Component, inject, OnInit, input } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartItem, Product } from '../../types/data-types';
import { ProductSliderComponent } from '../../component/product-slider/product-slider.component';
import { AllproductsService } from '../../services/allproducts.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-display',
  standalone: true,
  imports: [ProductSliderComponent, MatButtonModule, MatIconModule],
  templateUrl: './product-display.component.html',
  styleUrl: './product-display.component.scss',
})
export class ProductDisplayComponent implements OnInit {
  productService = inject(ProductService);
  activatedRoute = inject(ActivatedRoute);
  allProductService = inject(AllproductsService);
  wishlistService = inject(WishlistService);
  id: string | null = null;
  product!: Product;
  finalPrice: number = 0;
  wishlist: Product[] = [];
  cartlist: Product[] = [];
  similarProducts: Product[] = [];
  cartService = inject(CartService);
  // item = input.required<Product>();

  ngOnInit(): void {
    this.getWishList();
    this.getCartList();

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.getproductDetail(this.id);
      }
    });
    this.finalPrice = this.calculateFinalPrice();
  }

  getWishList() {
    this.wishlistService.getWishlitItems().subscribe((data) => {
      this.wishlist = data;
    });
  }

  getCartList() {
    this.cartService.getCartItems().subscribe((data) => {
      console.log(data);
    });
  }

  isInWishlist(item: any): boolean {
    return this.wishlist.some((w) => w._id === item._id);
  }

  isInCart(item: Product): boolean {
    return this.cartlist.some((w) => w._id === item._id);
  }

  changeMainImage(selectedImage: string) {
    if (this.product && this.product.image.length > 0) {
      this.product.image[0] = selectedImage;
    }
  }

  calculateFinalPrice(): number {
    if (this.product && this.product.price && this.product.discount) {
      const finalPrice =
        this.product.price - (this.product.price * this.product.discount) / 100;
      return finalPrice;
    }
    return 0;
  }

  getproductDetail(id: string) {
    if (id) {
      this.productService.getProduct(id).subscribe((data) => {
        // console.log(data);
        if (data) {
          this.product = data;
          if (!this.product.image) {
            this.product.image = [];
          }
          this.finalPrice = this.calculateFinalPrice();
          this.getsimilarProducts();
        }
      });
    }
  }

  getsimilarProducts() {
    if (!this.product) return;
    const categoryId = this.product.categoryId._id || '';
    // console.log('Fetching Similar Products for:', categoryId);
    this.allProductService
      .getSearchProducts('', categoryId, '', '', 1, 1, 5)
      .subscribe((data) => {
        this.similarProducts = data;
        this.similarProducts = this.similarProducts.filter(
          (product) => product._id !== this.id
        );
        // console.log('similar product:', this.similarProducts);
      });
  }

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

  addToCart(product: Product) {
    if (!this.isInCart(product)) {
      this.cartService.addToCartItems(product._id!, 1).subscribe({
        next: () => this.getCartList(),
        error: (error) => console.error('Error adding to cart:', error),
      });
    } else {
      this.cartService.removeFromCart(product._id!).subscribe({
        next: () => this.getCartList(),
        error: (error) => console.error('Error deleting from cart:', error),
      });
    }
  }
}
