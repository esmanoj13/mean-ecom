import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Brand, Category, Product } from '../types/data-types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AllproductsService {
  http = inject(HttpClient);
  private $apiURL = environment.API_URL;
  constructor() {}
  getNewProducts() {
    // console.log('new token token:');
    return this.http.get<Product[]>(`${this.$apiURL}/product/new-products`);
  }
  getFeaturedProducts() {
    // console.log('featured token:');
    return this.http.get<Product[]>(
      `${this.$apiURL}/product/featured-products`
    );
  }
  getcategories() {
    return this.http.get<Category[]>(`${this.$apiURL}/category`);
  }
  getAllBrands() {
    return this.http.get<Brand[]>(`${this.$apiURL}/brand`);
  }
  getSearchProducts(
    searchTerm: string,
    categoryId: string,
    brandId: string,
    sortBy: string,
    sortOrder: Number,
    page: Number,
    pageSize: Number
  ) {
    return this.http.get<Product[]>(
      `${this.$apiURL}/product?searchTerm=${searchTerm}&categoryId=${categoryId}&brandId=${brandId}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`
    );
  }
}
