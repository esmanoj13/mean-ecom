import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { Category } from '../../../types/data-types';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../services/category.service';
@Component({
  selector: 'app-formbrand',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './formbrand.component.html',
  styleUrl: './formbrand.component.scss',
})
export class FormbrandComponent implements OnInit {
  brandService = inject(BrandService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  categoryService = inject(CategoryService);
  name: any;
  selectedCategory: string = '';
  id!: string;
  isEdit = false;
  categories: Category[] = [];
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.isEdit = true;
      this.brandService.editBrand(this.id).subscribe((data: any) => {
        this.name = data.name;
        this.selectedCategory = data.category;
      });
    }
    this.categoryService.getcategories().subscribe((data: any) => {
      this.categories = data;
    });
  }
  addBrand() {
    this.brandService.addBrand(this.name, this.selectedCategory).subscribe({
      next: (data) => {
        console.log('Brand added successfully:', data);
        this.router.navigateByUrl('admin/brand');
      },
      error: (err) => {
        console.error('Error adding category:', err);
      },
    });
  }
  updateBrand() {
    this.brandService
      .updateBrands(this.id, this.name, this.selectedCategory)
      .subscribe({
        next: (data) => {
          this.router.navigateByUrl('admin/brand');
        },
        error: (err) => {
          console.error('Error update category:', err);
        },
      });
  }
}
