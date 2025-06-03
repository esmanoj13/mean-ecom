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
import { CategoryService } from '../../../services/category.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIcon,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements AfterViewInit, OnInit {
  categoryService = inject(CategoryService);
  router = inject(Router);
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private location: Location) {
    this.dataSource = new MatTableDataSource([] as any);
  }
  ngOnInit(): void {
    this.categorylist();
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

  categorylist() {
    this.categoryService.getcategories().subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
      },
      error(err) {
        console.error('Error fetching categories:', err);
      },
    });
  }
  navigateToCategoryForm() {
    this.router.navigate(['admin/category/add']);
  }
  deletecategory(id: string) {
    console.log(id);
    this.categoryService.deleteCategory(id).subscribe({
      next: (data) => {
        console.log('delete category:', data);
        this.categorylist();
      },
      error(err) {
        console.error('Error adding category:', err);
      },
    });
  }
  editcategory(id: string) {
    console.log(id);
    this.categoryService.editCategory(id).subscribe({
      next: (data: any) => {
        console.log('update category:', data._id);
        this.router.navigateByUrl(`admin/category/${data._id}`);
      },
      error(err: any) {
        console.error('Error updating category:', err);
      },
    });
  }
  goBack() {
    this.location.back();
  }
}
