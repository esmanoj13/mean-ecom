import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  importProvidersFrom,
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
import { BrandService } from '../../../services/brand.service';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-brand',
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
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
})
export class BrandComponent implements AfterViewInit, OnInit {
  constructor(private location: Location) {
    this.dataSource = new MatTableDataSource([] as any);
  }
  brandService = inject(BrandService);
  router = inject(Router);
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {
    this.brandlist();
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
  brandlist() {
    this.brandService.getAllBrands().subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataSource.data = data;
      },
      error(err) {
        console.error('Error fetching brands:', err);
      },
    });
  }
  getBrandForm() {
    this.router.navigateByUrl('/admin/brand/add');
  }
  deleteBrands(id: string) {
    this.brandService.deleteBrands(id).subscribe({
      next: (data) => {
        console.log('delete brand:', data);
        this.brandlist();
      },
      error(err) {
        console.error('Error adding brand:', err);
      },
    });
  }
  updateBrand(id: string) {
    this.brandService.editBrand(id).subscribe({
      next: (data: any) => {
        console.log('update brand:', data._id);
        this.router.navigateByUrl(`admin/brand/${data._id}`);
      },
      error(err: any) {
        console.error('Error updating brand:', err);
      },
    });
  }
  goBack() {
    this.router.navigateByUrl('/dashboard');
    // this.location.back();
  }
}
