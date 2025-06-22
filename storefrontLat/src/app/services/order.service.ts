import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from '../types/data-types';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private $apiURL = environment.API_URL;
  http = inject(HttpClient);
  constructor() {}
  addorder(order: Order) {
    return this.http.post<Order>(`${this.$apiURL}/order/addorder`, order);
  }
  // deleteOrder(id: string) {
  //   return this.http.delete(`${this.$apiURL}/order/deleteorder/${id}`);
  // }
  getCustomerOrder() {
    return this.http.get(`${this.$apiURL}/order/orders`);
  }
  getAllOrders() {
    return this.http.get(`${this.$apiURL}/order/allorders`);
  }
}
