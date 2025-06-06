import { Component, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Brand, Category, Product } from '../../../types/data-types';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
@Component({
  selector: 'app-formproduct',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './formproduct.component.html',
  styleUrl: './formproduct.component.scss',
})
export class FormproductComponent implements OnInit {
  environment = environment;
  selectedFiles: File[] = [];
  existingImageUrls: string[] = [];
  previewUrls: string[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  id: string = '';
  isEdit = false;
  fb = inject(FormBuilder);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  brandService = inject(BrandService);
  location = inject(Location);

  constructor() {}

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    shortDescription: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(250)]],
    categoryId: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    discount: [0, [Validators.min(0), Validators.max(100)]],
    isFeatured: [false],
    isNewProduct: [false],
    images: this.fb.array([], this.atLeastOneImage),
  });

  atLeastOneImage(control: AbstractControl): ValidationErrors | null {
    const images = control.value;
    return images && images.length > 0 ? null : { atLeastOneImage: true };
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.isEdit = true;
      this.productService.editProduct(this.id).subscribe((data) => {
        this.productForm.patchValue({
          ...data,
          categoryId: data.categoryId?._id || '',
          brandId: data.brandId?._id || '',
        });
        this.existingImageUrls = data.images || [];
        for (let img of this.existingImageUrls) {
          this.images.push(this.fb.control(null));
        }
      });
    } else {
      this.addimage();
    }
    this.categoryService.getcategories().subscribe((data: any) => {
      this.categories = data;
    });

    this.brandService.getAllBrands().subscribe((data: any) => {
      this.brands = data;
    });
  }
  get images() {
    return this.productForm.get('images') as FormArray;
  }
  get formValidation() {
    return this.productForm.controls;
  }
  addimage() {
    this.images.push(this.fb.control(null));
  }

  deleteimage(index: any) {
    this.existingImageUrls.splice(index, 1);
    this.images.removeAt(index);
  }
  updateProduct() {
    if (!this.id || this.productForm.invalid) return;
    const formData = new FormData();
    // Append existing image URLs
    for (const url of this.existingImageUrls) {
      formData.append('images', url);
    }
    // Append newly selected files
    for (const file of this.selectedFiles) {
      formData.append('images', file);
    }
    for (const key in this.productForm.value) {
      if (key !== 'images') {
        formData.append(key, (this.productForm.value as any)[key]);
      }
    }

    this.productService.updateProduct(this.id, formData).subscribe({
      next: () => this.router.navigateByUrl('/admin/product'),
      error: (err) => console.error(err),
    });
  }

  addProduct() {
    if (this.productForm.invalid || this.selectedFiles.length === 0) return;
    const formData = new FormData();
    for (const file of this.selectedFiles) {
      formData.append('images', file);
    }

    // Append form fields
    for (const key in this.productForm.value) {
      if (key !== 'images') {
        formData.append(key, (this.productForm.value as any)[key]);
      }
    }

    this.productService.addProduct(formData as any).subscribe({
      next: () => this.router.navigateByUrl('/admin/product'),
      error: (err) => console.error(err),
    });
  }

  onImageSelect(event: any) {
    this.previewUrls.forEach((url) => URL.revokeObjectURL(url));

    this.selectedFiles = Array.from(event.target.files);
    this.previewUrls = [];

    for (const file of this.selectedFiles) {
      const objectUrl = URL.createObjectURL(file);
      this.previewUrls.push(objectUrl);
    }
  }
  goBack() {
    this.location.back();
  }
}
