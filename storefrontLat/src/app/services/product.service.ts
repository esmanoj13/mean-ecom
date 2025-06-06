import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '../types/data-types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}
  private $apiURL = environment.API_URL;
  http = inject(HttpClient);

  getAllProducts() {
    return this.http.get<Product[]>(`${this.$apiURL}/product`);
  }

  addProduct(model: Product) {
    return this.http.post<Product>(`${this.$apiURL}/product`, model);
  }

  deleteProduct(id: string) {
    return this.http.delete<Product>(`${this.$apiURL}/product/${id}`);
  }

  editProduct(id: string) {
    return this.http.get<Product>(`${this.$apiURL}/product/${id}`);
  }

  updateProduct(id: string, data: FormData) {
    return this.http.put<Product>(`${this.$apiURL}/product/${id}`, data);
  }
  getProduct(id: string) {
    return this.http.get<Product>(`${this.$apiURL}/product/${id}`);
  }
}
