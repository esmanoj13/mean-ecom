import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private apiUrl = `${environment.API_URL}/api/coupons`;

  constructor(private http: HttpClient) {}

  validateCoupon(code: string, cartTotal: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate`, { code, cartTotal });
  }

  // Admin methods
  createCoupon(couponData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, couponData);
  }

  listCoupons(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateCoupon(id: string, couponData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, couponData);
  }

  deleteCoupon(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
