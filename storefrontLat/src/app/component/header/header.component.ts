import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Brand, Category, Product } from '../../types/data-types';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { AllproductsService } from '../../services/allproducts.service';
import { BrandService } from '../../services/brand.service';
import { MatIcon } from '@angular/material/icon';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FormsModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  searchTerm: string = '';
  categoryId: string = '';
  categoryName: string = '';
  brandId: string = '';
  router = inject(Router);
  route = inject(ActivatedRoute);
  brandService = inject(BrandService);
  authService = inject(AuthService);
  categoryService = inject(CategoryService);
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  ecommCompany: string = 'EasyMart';
  category: Category[] = [];
  brand: Brand[] = [];
  ngOnInit(): void {
    this.categoryService.getcategories().subscribe((data) => {
      this.category = data;
    });

    this.brandService.getAllBrands().subscribe((data) => {
      this.brand = data;
    });
    // Subscribe to query parameter changes
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.categoryId = params['categoryId'] || '';
      this.brandId = params['brandId'] || '';
    });
  }

  wishlistCount = computed(() => this.wishlistService.wishlistItems().length);
  cartItemCount = computed(() => this.cartService.cartItems().length);

  searchitem(event: any) {
    let searchValue = event.target.value.trim();
    if (!searchValue) return;
    this.router.navigate(['/search'], {
      queryParams: { search: searchValue },
      queryParamsHandling: 'merge',
    });
  }

  searchCategory(id: string) {
    this.searchTerm = '';
    this.router.navigate(['/product'], {
      queryParams: { categoryId: id, search: null },
      queryParamsHandling: 'merge',
    });
  }

  searchBrand(id: string) {
    this.searchTerm = '';
    this.router.navigate(['/product'], {
      queryParams: { brandId: id, search: null },
      queryParamsHandling: 'merge',
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
