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
  name: string = '';
  selectedCategory: Category | null = null;
  // Use null to handle the case when no category is selected
  id!: string;
  isEdit = false;
  categories: Category[] = [];
  ngOnInit(): void {
    // Check if we are editing an existing brand
    // If the route has a parameter 'id', we are editing
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.isEdit = true;
      this.categoryService.getcategories().subscribe((data: any) => {
        this.categories = data;
      });
      // Fetch the brand details to pre-fill the form
      // Use the brandService to get the brand by id
      this.brandService.editBrand(this.id).subscribe((data: any) => {
        this.name = data.name;
        this.selectedCategory = data.categoryId;
        // Important:Ensure selectedCategory is set correctly
        // Find the category in the categories list
        // SelectedCategory is  exactly the same object reference as the
        // one in the dropdown list,So Angular Material knows which one to display.
        this.selectedCategory =
          this.categories.find((cat) => cat._id === data.categoryId._id) ||
          null;
      });
    }
  }
  addBrand() {
    if (!this.selectedCategory || !this.selectedCategory._id) return;
    this.brandService.addBrand(this.name, this.selectedCategory._id).subscribe({
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
    if (!this.selectedCategory || !this.selectedCategory._id) return;
    // Ensure selectedCategory is not null and has an _id
    this.brandService
      .updateBrands(this.id, this.name, this.selectedCategory?._id)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigateByUrl('admin/brand');
        },
        error: (err) => {
          console.error('Error update category:', err);
        },
      });
  }
}
