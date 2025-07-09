import { HttpClient } from '@angular/common/http';
import { Injectable, afterNextRender, inject } from '@angular/core';
import { Register, Login } from '../types/data-types';
import { environment } from '../../environments/environment';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  constructor() {}
  private $apiURL = environment.API_URL;
  onRegister(user: Register) {
    return this.http.post<Register>(`${this.$apiURL}/auth/register`, user);
  }
  onLogin(email: string, password: string) {
    return this.http
      .post(`${this.$apiURL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response: any) => {
          if (response?.token) {
            this.setAuthData(response.token, response.user);
          }
        })
      );
  }
  private setAuthData(token: string, user: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          id: user._id,})
      );
      // Reload cart and wishlist after setting auth data
      if (this.cartService && this.wishlistService) {
        this.cartService.loadcart();
        this.wishlistService.loadWishlist();
      }
    }
  }
  get loggedIn() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  get isAdmin() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData).isAdmin;
      } else {
        return false;
      }
    }
  }
  get userName() {
    if (typeof window !== 'undefined' && window.localStorage) {
      let userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData).name;
      }
      return null;
    }
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.cartService.cartSignal.set([]);
    this.wishlistService.wishlistSignal.set([]);
  }

  get customerData() {
    if (typeof window !== 'undefined' && window.localStorage) {
      let userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    }
  }
  forgotPassword(email: string) {
    return this.http.post(`${this.$apiURL}/auth/forgot-password`, {
      email,
    });
  }
  resetPassword(token: string, password: string) {
    return this.http.post(`${this.$apiURL}/auth/reset-password`, {
      token,
      password,
    });
  }
}
