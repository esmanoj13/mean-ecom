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

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  ngOnInit(): void {
    this.cartService.loadcart();
  }
  cartService = inject(CartService);
  fb = inject(FormBuilder);
  selectedPaymentMethod = 'cod';
  checkoutForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    address1: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    address2: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    state: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    country: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    pincode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    contact: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
  });
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
  getShipping() {
    return this.getSubTotalPrice() > 0 ? 10 : 0; // Example shipping cost
  }
  getTotalPrice(): number {
    return this.getSubTotalPrice() + this.getShipping();
  }
}
