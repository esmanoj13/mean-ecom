import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-formcategory',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './formcategory.component.html',
  styleUrl: './formcategory.component.scss',
})
export class FormcategoryComponent implements OnInit {
  categoryService = inject(CategoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  name: any;
  id!: string;
  isEdit = false;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.isEdit = true;
      this.categoryService.editCategory(this.id).subscribe((data) => {
        this.name = data.name;
      });
    }
  }

  addCategory() {
    this.categoryService.addCategory(this.name).subscribe({
      next: (data) => {
        this.router.navigateByUrl('admin/category');
      },
      error: (err) => {
        console.error('Error adding category:', err);
      },
    });
  }

  updateCategory() {
    this.categoryService.updateCategory(this.id, this.name).subscribe({
      next: (data) => {
        this.router.navigateByUrl('admin/category');
      },
      error: (err) => {
        console.error('Error update category:', err);
      },
    });
  }
}
