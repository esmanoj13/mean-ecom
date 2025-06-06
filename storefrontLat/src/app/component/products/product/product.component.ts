import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Location } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../types/data-types';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements AfterViewInit, OnInit {
  environment = environment;
  constructor(private location: Location) {
    this.dataSource = new MatTableDataSource([] as any);
  }
  productService = inject(ProductService);
  router = inject(Router);
  displayedColumns: string[] = [
    'id',
    'image',
    'name',
    'shortDescription',
    'brand',
    'category',
    'price',
    'discount',
    'action',
  ];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {
    this.productlist();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getProductForm() {
    this.router.navigate(['admin/product/add']);
  }

  productlist() {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.dataSource.data = data;
        console.log(' productlist:', data);
      },
      error(err) {
        console.error('Error fetching product:', err);
      },
    });
  }

  updateProduct(id: string) {
    this.productService.editProduct(id).subscribe({
      next: (data: any) => {
        console.log('update product:', data._id);
        this.router.navigateByUrl(`admin/product/${data._id}`);
      },
      error(err: any) {
        console.error('Error updating brand:', err);
      },
    });
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe({
      next: (data) => {
        console.log('delete brand:', data);
        this.productlist();
      },
      error(err) {
        console.error('Error adding brand:', err);
      },
    });
  }
  goBack() {
    this.router.navigateByUrl('/dashboard');
    // this.location.back();
  }
}
