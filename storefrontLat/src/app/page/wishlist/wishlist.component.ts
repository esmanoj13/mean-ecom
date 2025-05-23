import { Component, inject, OnInit } from '@angular/core';
import { ProductSliderComponent } from '../../component/product-slider/product-slider.component';
import { WishlistService } from '../../services/wishlist.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [ProductSliderComponent, MatButtonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  products: any;
  wishlistService = inject(WishlistService);

  ngOnInit(): void {
    this.wishlistService.getWishlitItems().subscribe((data) => {
      this.products = data;
    });
  }
}
