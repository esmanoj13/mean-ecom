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
import { CouponsComponent } from './component/coupons/coupons.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { authGuard } from './guard/auth-guard';
import { adminGuard } from './guard/admin-guard';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { WishlistComponent } from './page/wishlist/wishlist.component';
import { CartComponent } from './page/cart/cart.component';
import { SearchComponent } from './page/search/search.component';
import { CheckoutComponent } from './page/checkout/checkout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { AllOrdersComponent } from './page/all-orders/all-orders.component';
import { OrderSuccessComponent } from './page/order-success/order-success.component';
import { OrdersComponent } from './page/orders/orders.component';
import { OrderDetailComponent } from './page/order-detail/order-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
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
        path: 'cart',
        component: CartComponent,
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
        // canActivate: [adminGuard],
      },
      {
        path: 'wishlist',
        component: WishlistComponent,
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
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [authGuard],
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
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: 'order-success',
        component: OrderSuccessComponent,
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'allorders',
        component: AllOrdersComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'admin/coupons',
        component: CouponsComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'order/:id',
        component: OrderDetailComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
