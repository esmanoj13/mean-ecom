import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Brand } from '../types/data-types';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  constructor() {}
  private $apiURL = environment.API_URL;
  http = inject(HttpClient);
  getAllBrands() {
    return this.http.get<Brand[]>(`${this.$apiURL}/brand`);
  }

  addBrand(name: string, selectedCategory: string) {
    return this.http.post<Brand>(`${this.$apiURL}/brand`, {
      name: name,
      categoryId: selectedCategory,
    });
  }
  deleteBrands(id: string) {
    return this.http.delete<Brand>(`${this.$apiURL}/brand/${id}`);
  }
  editBrand(id: string) {
    // console.log(id);
    return this.http.get<Brand>(`${this.$apiURL}/brand/${id}`);
  }

  updateBrands(id: string, name: string, selectedCategory: string) {
    return this.http.put<Brand>(`${this.$apiURL}/brand/${id}`, {
      name: name,
      categoryId: selectedCategory,
    });
  }
}
