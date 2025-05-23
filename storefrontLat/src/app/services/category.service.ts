import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Category } from '../types/data-types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private $apiURL = environment.API_URL;
  http = inject(HttpClient);
  constructor() {}

  getcategories() {
    return this.http.get<Category[]>(`${this.$apiURL}/category`);
  }
  addCategory(name: string) {
    return this.http.post(`${this.$apiURL}/category`, {
      name: name,
    });
  }
  deleteCategory(id: string) {
    return this.http.delete(`${this.$apiURL}/category/${id}`);
  }
  editCategory(id: string) {
    return this.http.get<Category>(`${this.$apiURL}/category/${id}`);
  }
  updateCategory(id: string, name: string) {
    return this.http.put(`${this.$apiURL}/category/${id}`, {
      name: name,
    });
  }
}
