import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AllproductsService } from '../../services/allproducts.service';
import { Brand, Category, Product } from '../../types/data-types';
import { ProductSliderComponent } from '../../component/product-slider/product-slider.component';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductSliderComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  productService = inject(AllproductsService);
  categoryService = inject(CategoryService);
  brandService = inject(BrandService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  searchTerm: string = '';
  categoryId: string = '';
  categoryName: string = '';
  brandId: string = '';
  sortBy: string = '';
  sortOrder: number = 1;
  page: number = 0;
  pageSize: number = 10;

  products: Product[] = [];
  categorys: Category[] = [];
  brands: Brand[] = [];

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchBrands();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.categoryId = params['categoryId'] || '';
      this.brandId = params['brandId'] || '';
      this.getsearchProducts();
      this.getCategoryName(this.categoryId);
    });
  }

  getsearchProducts() {
    this.productService
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
  }

  fetchCategories() {
    this.categoryService.getcategories().subscribe({
      next: (data) => {
        this.categorys = data;
        this.getCategoryName(this.categoryId);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }
  fetchBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => {
        console.error('Error fetching brands:', err);
      },
    });
  }
  // Update category filter in the URL and reset the search input
  onCategoryChange(categoryId: string): void {
    if (!categoryId) return;
    this.searchTerm = '';
    this.router.navigate([], {
      queryParams: { categoryId },
      queryParamsHandling: 'merge',
    });
    this.getCategoryName(categoryId);
  }

  /** Updates query params when brand changes */
  onBrandChange(brandId: string): void {
    if (!brandId) return;
    this.searchTerm = '';
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
  getCategoryName(categoryId: string) {
    const selectedCategory = this.categorys.find(
      (cat) => cat._id === categoryId
    );
    if (selectedCategory) {
      this.categoryName = selectedCategory.name;
    }
  }
}
