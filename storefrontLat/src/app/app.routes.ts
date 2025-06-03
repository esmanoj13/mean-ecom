import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { CategoryComponent } from './component/categories/category/category.component';
import { FormcategoryComponent } from './component/categories/formcategory/formcategory.component';
import { BrandComponent } from './component/brands/brand/brand.component';
import { FormbrandComponent } from './component/brands/formbrand/formbrand.component';
import { ProductComponent } from './component/products/product/product.component';
import { FormproductComponent } from './component/products/formproduct/formproduct.component';
import { ProductDisplayComponent } from './page/product-display/product-display.component';
import { ProductListComponent } from './page/product-list/product-list.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';

import { DashboardComponent } from './component/dashboard/dashboard.component';
import { authGuard } from './guard/auth-guard';
import { adminGuard } from './guard/admin-guard';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { WishlistComponent } from './page/wishlist/wishlist.component';
import { CartComponent } from './page/cart/cart.component';
import { SearchComponent } from './page/search/search.component';
import { CheckoutComponent } from './page/checkout/checkout.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin/category',
    component: CategoryComponent,
    // canActivate: [adminGuard],
  },
  {
    path: 'admin/category/add',
    component: FormcategoryComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/category/:id',
    component: FormcategoryComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/brand',
    component: BrandComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/brand/add',
    component: FormbrandComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/brand/:id',
    component: FormbrandComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/product',
    component: ProductComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/product/add',
    component: FormproductComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/product/:id',
    component: FormproductComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'product',
    component: ProductListComponent,
    // canActivate: [adminGuard],
  },
  {
    path: 'product/:id',
    component: ProductDisplayComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard],
  },
];
