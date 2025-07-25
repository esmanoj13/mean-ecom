import { Component, inject, OnInit, input } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../types/data-types';
import { ProductSliderComponent } from '../../component/product-slider/product-slider.component';
import { AllproductsService } from '../../services/allproducts.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-product-display',
  standalone: true,
  imports: [ProductSliderComponent, MatButtonModule, MatIconModule],
  templateUrl: './product-display.component.html',
  styleUrl: './product-display.component.scss',
})
export class ProductDisplayComponent implements OnInit {
  environment = environment;
  productService = inject(ProductService);
  activatedRoute = inject(ActivatedRoute);
  allProductService = inject(AllproductsService);
  wishlistService = inject(WishlistService);
  authService = inject(AuthService);
  router = inject(Router);
  id: string | null = null;
  product!: Product;
  finalPrice: number = 0;
  cartlist: Product[] = [];
  similarProducts: Product[] = [];
  cartService = inject(CartService);
  wishlist = this.wishlistService.wishlistItems;

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
    this.wishlistService.wishlistItems;
  }

  getCartList() {
    this.cartService.loadcart();
  }

  isInCart(item: Product): boolean {
    return this.cartlist.some((w) => w._id === item._id);
  }

  changeMainImage(selectedImage: string) {
    if (this.product && this.product.images.length > 0) {
      this.product.images[0] = selectedImage;
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
          if (!this.product.images) {
            this.product.images = [];
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
  toggleWishlist(product: Product) {
    if (!this.authService.loggedIn) {
      this.router.navigate(['/login']);
      return;
    } else {
      this.wishlistService.toogleWishlist(product);
    }
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
