import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { OrderDTO } from '../dtos/order/order.dto';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;
  private apiGetAllOrders = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: OrderDTO): Observable<any> {    
    // Gửi yêu cầu đặt hàng
    return this.http.post(this.apiUrl, orderData);
  }
  getOrderById(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.get(url);
  }
  getAllOrders(keyword: string, page: number, limit: number): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('keyword', keyword)      
      .set('page', page.toString())
      .set('limit', limit.toString());            
    return this.http.get<ApiResponse>(this.apiGetAllOrders, { params });
  }

  updateOrder(orderId: number, orderData: OrderDTO): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.put<ApiResponse>(url, orderData);
  }

  deleteOrder(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.delete(url,{responseType: 'text'});
  }

  updateOrderStatus(orderId: number, status: string): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}/status`;
    const params = new HttpParams().set('status', status); 
    return this.http.put<ApiResponse>(url, null, { params }); 
  }

  getPurchaseHistory(userId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/user/${userId}/history`); 
  }

  cancelOrder(orderId: number): Observable<ApiResponse> { 
    return this.http.put<ApiResponse>(`${this.apiUrl}/${orderId}/cancel`, {}); 
  }

  exportInvoice(orderId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${orderId}/invoice`, {
      responseType: 'blob' 
    });
  }
}
