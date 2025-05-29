import { Component, inject, OnInit } from '@angular/core';
import { ProductSliderComponent } from '../../component/product-slider/product-slider.component';
import { WishlistService } from '../../services/wishlist.service';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../types/data-types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [ProductSliderComponent, MatButtonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  // products: Product[] = [];
  wishlistService = inject(WishlistService);

  ngOnInit(): void {
    this.wishlistService.loadWishlist();
  }
  wishlistItems = this.wishlistService.wishlistItems;
}
