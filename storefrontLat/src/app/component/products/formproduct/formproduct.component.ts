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
  ],
  templateUrl: './formproduct.component.html',
  styleUrl: './formproduct.component.scss',
})
export class FormproductComponent implements OnInit {
  id: string = '';
  isEdit = false;
  fb = inject(FormBuilder);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  brandService = inject(BrandService);
  constructor() {}
  categories: Category[] = [];
  brands: Brand[] = [];

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    shortdescription: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(250)]],
    categoryId: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(0)]],
    discount: ['', [Validators.min(0), Validators.max(100)]],
    isFeatured: [false],
    isNewProduct: [false],
    image: this.fb.array([], this.atLeastOneImage),
  });

  atLeastOneImage(control: AbstractControl): ValidationErrors | null {
    const images = control.value; // Get array values
    return images && images.length > 0 ? null : { atLeastOneImage: true };
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;

    if (this.id) {
      this.isEdit = true;
      this.productService.editProduct(this.id).subscribe((data) => {
        console.log(data.image.length);
        for (let i = 0; i < data.image.length; i++) {
          this.addimage();
        }
        this.productForm.patchValue(data as any);
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
    return this.productForm.get('image') as FormArray;
  }
  get formValidation() {
    return this.productForm.controls;
  }

  addimage() {
    this.images.push(this.fb.control(null));
  }

  deleteimage() {
    if (this.images.length > 0) {
      this.images.removeAt(this.images.controls.length - 1);
    }
  }
  updateProduct() {
    let value = this.productForm.value;
    console.log();
    this.productService.updateProduct(this.id, value as any).subscribe({
      next: (data) => {
        console.log('add', data);
        this.router.navigateByUrl('/admin/product');
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
    });
  }

  addProduct() {
    let value = this.productForm.value;
    console.log(value);
    if (value) {
      this.productService.addProduct(value as any).subscribe({
        next: (data) => {
          console.log('add', data);
          this.router.navigateByUrl('/admin/product');
        },
        error: (error) => {
          console.error('Error occurred:', error);
        },
      });
    }
  }
}
