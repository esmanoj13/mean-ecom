import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CartService } from '../../services/cart.service';
import { CouponService } from '../../services/coupon.service';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  environment = environment;
  ecommCompany: string = 'EasyMart';
  router = inject(Router);
  couponService = inject(CouponService);

  // Coupon related properties
  appliedCoupon: any = null;
  couponError: string = '';
  couponSuccess: string = '';

  ngOnInit(): void {
    this.cartService.loadcart();
  }
  cartService = inject(CartService);
  fb = inject(FormBuilder);
  selectedPaymentMethod = 'cod';
  checkoutForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    address1: ['', [Validators.required]],
    address2: ['', [Validators.required]],
    city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    state: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    country: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    pincode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    contact: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    couponCode: [''],
  });

  // Coupon Methods
  applyCoupon() {
    const code = this.checkoutForm.get('couponCode')?.value;
    if (!code) {
      this.couponError = 'Please enter a coupon code';
      return;
    }

    const cartTotal = this.cartService.getTotal();
    this.couponService.validateCoupon(code, cartTotal).subscribe({
      next: (response) => {
        console.log(response);
        this.appliedCoupon = response.coupon;
        this.couponSuccess = 'Coupon applied successfully!';
        this.couponError = '';
      },
      error: (error) => {
        this.couponError = error.error.message || 'Failed to apply coupon';
        this.couponSuccess = '';
        this.appliedCoupon = null;
      },
    });
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.couponSuccess = '';
    this.couponError = '';
    this.checkoutForm.get('couponCode')?.reset();
  }
  get formValidation() {
    return this.checkoutForm.controls;
  }
  proccedToSaveAddress() {}
  getcartItems() {
    return this.cartService.cartItems();
  }
  getSubTotalPrice() {
    return this.cartService
      .cartItems()
      .reduce((total, item) => total + item.productId.price * item.quantity, 0);
  }

  getDiscountAmount(): number {
    if (!this.appliedCoupon) return 0;

    const subtotal = this.getSubTotalPrice();
    if (subtotal < this.appliedCoupon.minPurchase) return 0;
    if (this.appliedCoupon.type === 'percentage') {
      const discount = (subtotal * this.appliedCoupon.value) / 100;
      return this.appliedCoupon.maxDiscount
        ? Math.min(discount, this.appliedCoupon.maxDiscount)
        : discount;
    } else {
      return this.appliedCoupon.value;
    }
  }

  getFinalPrice(): number {
    const subtotal = this.getSubTotalPrice();
    const discount = this.getDiscountAmount();
    return subtotal - discount;
  }
  getShipping() {
    return this.getSubTotalPrice() > 0 ? 10 : 0; // Example shipping cost
  }
  getTotalPrice(): number {
    return this.getSubTotalPrice() + this.getShipping();
  }
  openCart() {
    this.router.navigateByUrl('/cart');
  }
}
