import { Component, OnInit, inject } from '@angular/core';
import { ProductSliderComponent } from '../product-slider/product-slider.component';
import { Product } from '../../types/data-types';
import { AllproductsService } from '../../services/allproducts.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductSliderComponent, CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      1200: {
        items: 1,
      },
      // 740: {
      //   items: 3,
      // },
      // 940: {
      //   items: 4,
      // },
    },
    nav: true,
  };

  link: string[] = ['/product/'];
  images = ['/images/image-slider-2.webp', '/images/image-slider-2.webp'];

  newProducts: Product[] = [];
  featuredProducts: Product[] = [];
  allProductService = inject(AllproductsService);
  wishlistService = inject(WishlistService);
  
  ngOnInit() {
    this.allProductService.getNewProducts().subscribe({
      next: (data) => {
        this.newProducts = data;
      },
      error: (err) => {
        console.error('Error fetching new products:', err);
      },
    });

    this.allProductService.getFeaturedProducts().subscribe({
      next: (data) => {
        this.featuredProducts = data;
      },
      error: (err) => {
        console.error('Error fetching featured products:', err);
      },
    });
  }
}
