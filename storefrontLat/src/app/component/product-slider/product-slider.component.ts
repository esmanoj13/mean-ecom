import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../types/data-types';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-product-slider',
  standalone: true,
  imports: [
    CarouselModule,
    ProductCardComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product-slider.component.html',
  styleUrl: './product-slider.component.scss',
})
export class ProductSliderComponent {
  carouselOptions = {
    loop: true,
    margin: 20,

    dots: true,
    responsive: {
      0: { items: 1 },
      640: { items: 2 },
      1024: { items: 4 },
    },
  };
  title = input.required<string>();
  product = input.required<Product[]>();
}
