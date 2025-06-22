import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private http = inject(HttpClient);
  private $apiURL = environment.API_URL;
  getAddress() {
    return this.http.get(`${this.$apiURL}/customer/address`);
  }
  deleteAddress(id: string) {
    return this.http.delete(`${this.$apiURL}/customer/address/${id}`);
  }


  constructor() {}
}
