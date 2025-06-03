import { Component, OnInit, inject } from '@angular/core';
import { AllproductsService } from '../../services/allproducts.service';
import { Brand, Category, Product } from '../../types/data-types';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductSliderComponent } from '../../component/product-slider/product-slider.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ProductSliderComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  allproductService = inject(AllproductsService);
  categoryService = inject(CategoryService);
  brandService = inject(BrandService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  searchTerm: string = '';
  categoryId: string = '';
  brandId: string = '';
  sortBy: string = '';
  sortOrder: number = 1;
  page: number = 0;
  pageSize: number = 10;

  products: Product[] = [];
  category: Category[] = [];
  brand: Brand[] = [];
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.getsearchProducts();
    });

    this.categoryService.getcategories().subscribe((data) => {
      this.category = data;
    });
    this.brandService.getAllBrands().subscribe((data) => {
      this.brand = data;
    });
  }
  getsearchProducts() {
    setTimeout(() => {
      this.allproductService
        .getSearchProducts(
          this.searchTerm,
          this.categoryId,
          this.brandId,
          this.sortBy,
          this.sortOrder,
          this.page,
          this.pageSize
        )
        .subscribe({
          next: (data) => {
            this.products = data;
          },
          error: (err) => {
            console.error('Error fetching search products:', err);
          },
        });
    }, 100);
  }
  onCategoryChange(categoryId: string) {
    this.router.navigate([], {
      queryParams: { categoryId },
      queryParamsHandling: 'merge',
    });
  }

  /** Updates query params when brand changes */
  onBrandChange(brandId: string) {
    this.router.navigate([], {
      queryParams: { brandId },
      queryParamsHandling: 'merge',
    });
  }

  orderby(event: any) {
    this.sortBy = 'price';
    this.sortOrder = event;
    this.getsearchProducts();
  }
}
