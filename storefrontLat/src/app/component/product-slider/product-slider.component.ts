import { Component, inject, input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../types/data-types';
import { ProductCardComponent } from '../product-card/product-card.component';
@Component({
  selector: 'app-product-slider',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ProductCardComponent,
  ],
  templateUrl: './product-slider.component.html',
  styleUrl: './product-slider.component.scss',
})
export class ProductSliderComponent {
  title = input.required<string>();
  product = input.required<Product[]>();
}
