import { HttpClient } from '@angular/common/http';
import { Injectable, afterNextRender, inject } from '@angular/core';
import { Register, Login } from '../types/data-types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  constructor() {}
  private $apiURL = environment.API_URL;
  onRegister(name: string, email: string, password: string) {
    return this.http.post<Register>(`${this.$apiURL}/auth/register`, {
      name,
      email,
      password,
    });
  }
  onLogin(email: string, password: string) {
    return this.http.post(`${this.$apiURL}/auth/login`, {
      email,
      password,
    });
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
}
