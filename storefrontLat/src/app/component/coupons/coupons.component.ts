import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CouponService } from '../../services/coupon.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss',
})
export class CouponsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private couponService = inject(CouponService);
  protected router = inject(Router);

  couponForm: FormGroup;
  coupons: any[] = [];
  minDate = new Date(); // Set minimum date to today
  displayedColumns: string[] = [
    'code',
    'discountType',
    'value',
    'minPurchase',
    'expiresAt',
    'isActive',
    'actions',
  ];
  editingCouponId: string | null = null;
  constructor() {
    this.couponForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      discountType: ['percentage', Validators.required],
      value: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      minPurchase: ['', [Validators.required, Validators.min(0)]],
      maxDiscount: ['', [Validators.min(0)]],
      expiresAt: [''],
      isActive: [true],
    });

    // Update value validation when discount type changes
    this.couponForm.get('discountType')?.valueChanges.subscribe((type) => {
      const valueControl = this.couponForm.get('value');
      if (type === 'percentage') {
        valueControl?.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ]);
      } else {
        valueControl?.setValidators([Validators.required, Validators.min(0)]);
      }
      valueControl?.updateValueAndValidity();
    });
  }
  ngOnInit() {
    this.loadCoupons();
  }
  loadCoupons() {
    this.couponService.listCoupons().subscribe({
      next: (response) => {
        this.coupons = response.coupons;
      },
      error: (error) => {
        console.error('Error loading coupons:', error);
      },
    });
  }
  onSubmit() {
    if (this.couponForm.valid) {
      const couponData = this.couponForm.value;

      if (this.editingCouponId) {
        this.couponService
          .updateCoupon(this.editingCouponId, couponData)
          .subscribe({
            next: () => {
              this.resetForm();
              this.loadCoupons();
            },
            error: (error) => {
              console.error('Error updating coupon:', error);
            },
          });
      } else {
        // Create new coupon
        this.couponService.createCoupon(couponData).subscribe({
          next: () => {
            this.resetForm();
            this.loadCoupons();
          },
          error: (error) => {
            console.error('Error creating coupon:', error);
          },
        });
      }
    }
  }

  editCoupon(coupon: any) {
    this.editingCouponId = coupon._id;
    this.couponForm.patchValue({
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      minPurchase: coupon.minPurchase,
      maxDiscount: coupon.maxDiscount,
      expiresAt: coupon.expiresAt,
      isActive: coupon.isActive,
    });
  }

  deleteCoupon(id: string) {
    if (confirm('Are you sure you want to delete this coupon?')) {
      this.couponService.deleteCoupon(id).subscribe({
        next: () => {
          this.loadCoupons();
        },
        error: (error) => {
          console.error('Error deleting coupon:', error);
        },
      });
    }
  }

  resetForm() {
    this.editingCouponId = null;
    this.couponForm.reset({
      discountType: 'percentage',
      isActive: true,
    });
  }

  cancelEdit() {
    this.resetForm();
  }
  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
