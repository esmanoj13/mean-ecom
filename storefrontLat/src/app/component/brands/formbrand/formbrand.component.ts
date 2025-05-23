import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-formbrand',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './formbrand.component.html',
  styleUrl: './formbrand.component.scss',
})
export class FormbrandComponent implements OnInit {
  brandService = inject(BrandService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  name: any;
  id!: string;
  isEdit = false;
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    console.log(this.id);
    if (this.id) {
      this.isEdit = true;
      this.brandService.editBrand(this.id).subscribe((data: any) => {
        console.log(data);
        this.name = data.name;
      });
    }
  }
  addBrand() {
    this.brandService.addBrand(this.name).subscribe({
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
    this.brandService.updateBrands(this.id, this.name).subscribe({
      next: (data) => {
        this.router.navigateByUrl('admin/brand');
      },
      error: (err) => {
        console.error('Error update category:', err);
      },
    });
  }
}
