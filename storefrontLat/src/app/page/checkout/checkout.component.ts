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
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { AddressService } from '../../services/address.service';
import { OrderStatus } from '../../types/data-types';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  changeAddress: boolean = false;
  environment = environment;
  ecommCompany: string = 'EasyMart';
  router = inject(Router);
  couponService = inject(CouponService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  addressService = inject(AddressService);
  // Coupon related properties
  appliedCoupon: any = null;
  couponError: string = '';
  couponSuccess: string = '';
  addresses: any;
  selectedAddressId: string = '';

  ngOnInit(): void {
    this.cartService.loadcart();
    this.getAddress();
  }
  cartService = inject(CartService);
  fb = inject(FormBuilder);
  selectedPaymentMethod = 'cod';
  couponForm = this.fb.group({
    couponCode: [''],
  });
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
  changeToAddress() {
    this.changeAddress = !this.changeAddress;
  }
  proceedToSaveAddress() {}
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
  NewAddress() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    const formData = this.checkoutForm.value;
    let user = localStorage.getItem('user');
    if (!user) {
      console.log('user is not there');
      return;
    }
    const userId = JSON.parse(user)._id;
    const order = {
      name: formData.name!,
      email: formData.email!,
      userId: userId,
      address: {
        address1: formData.address1!,
        address2: formData.address2!,
        city: formData.city!,
        state: formData.state!,
        country: formData.country!,
        pincode: formData.pincode!,
      },
      contact: formData.contact!,
    };
  }
  goToOrder() {
    const user = this.authService.customerData;
    const discount = this.getDiscountAmount();
    const totalAmount = this.getFinalPrice() + this.getShipping();
    const finalAmount = totalAmount - discount;
    const userId = user._id;
    const order = {
      items: this.getcartItems(),
      userId: userId,
      paymentType: this.selectedPaymentMethod,
      discount: discount,
      coupon: this.appliedCoupon?.code ?? null,
      totalAmount: totalAmount,
      finalAmount: finalAmount,
      status: OrderStatus.Pending,
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };
    this.orderService.addorder(order).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/order-success');
      },
      error: (err) => {
        console.error;
      },
    });
  }

  getAddress() {
    this.addressService.getAddress().subscribe({
      next: (data) => {
        console.log(data);
        this.addresses = data;
        if (this.addresses.length > 0) {
          this.selectedAddressId = this.addresses[0]._id.toString();
        }
      },
      error: (err) => {
        console.error;
      },
    });
  }
  selectAddress(id: string) {
    this.selectedAddressId = id;
  }
  editAddress(address: any) {
    const user = this.authService.customerData;
    this.changeAddress = true;
    this.checkoutForm.patchValue({
      name: user.name,
      email: user.email,
      address1: address.address1,
      address2: address.address2!,
      city: address.city!,
      state: address.state!,
      country: address.country!,
      pincode: address.pincode!,
      contact: address.contact,
    });
    this.checkoutForm.get('name')?.disable();
    this.checkoutForm.get('email')?.disable();
  }
  deleteAddress(id: string) {
    this.addressService.deleteAddress(id).subscribe({
      next: (data) => {
        this.getAddress();
        this.checkoutForm.reset();
        this.changeAddress = !this.changeAddress;
      },
    });
  }
}
