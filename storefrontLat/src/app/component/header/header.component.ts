import {
  Component,
  inject,
  OnInit,
  computed,
  ElementRef,
  HostListener,
  viewChild,
  ViewChild,
} from '@angular/core';
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
  showDropdown = false;
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
  productService = inject(AllproductsService);
  ecommCompany: string = 'EasyMart';
  category: Category[] = [];
  brand: Brand[] = [];
  products: Product[] = [];
  @ViewChild('searchBox') searchBox!: ElementRef;
  constructor() {
    this.router.events.subscribe(() => {
      this.showDropdown = false;
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.searchBox?.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

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
    if (this.searchTerm.trim()) {
      console.log(this.searchTerm);
      this.searchitems();
    }
  }

  wishlistCount = computed(() => this.wishlistService.wishlistItems().length);
  cartItemCount = computed(() => this.cartService.cartItems().length);

  searchitem() {
    let searchValue = this.searchTerm.trim();
    if (!searchValue) return;
    this.router.navigate(['/search'], {
      queryParams: { search: searchValue },
      queryParamsHandling: 'merge',
    });
  }
  searchitems() {
    console.log('Searching for:', this.searchTerm);
    if (!this.searchTerm.trim()) {
      this.products = [];
      this.showDropdown = false;
      return;
    }
    this.productService
      .getSearchProducts(this.searchTerm, this.categoryId, '', '', 1, 1, 5)
      .subscribe({
        next: (data: Product[]) => {
          this.products = data;
          this.showDropdown = true;
          console.log('Search result:', data);
        },
        error: (error) => {
          console.error('Error fetching search results:', error);
          this.showDropdown = false;
        },
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
  selectProduct(id: string) {
    this.router.navigateByUrl(`/product/${id}`);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
