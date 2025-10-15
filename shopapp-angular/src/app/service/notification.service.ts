// File: src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service'; // Import AuthService
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiBaseUrl}/notifications`; // URL API thông báo

  constructor(
    private http: HttpClient,
    private authService: AuthService // Tiêm AuthService
  ) {}

  // Không cần token ở đây nữa vì Interceptor sẽ xử lý
  // private getAuthHeaders(): HttpHeaders {
  //   const token = this.authService.getToken(); // Lấy token từ AuthService
  //   return new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   });
  // }

  getNotifications(): Observable<any> { // API trả về ResponseObject
    // const headers = this.getAuthHeaders();
    return this.http.get<any>(this.apiUrl /*, { headers }*/);
  }

  getUnreadCount(): Observable<any> { // API trả về ResponseObject
    // const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/unread-count` /*, { headers }*/);
  }

  markAsRead(notificationId: number): Observable<any> {
    // const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/${notificationId}/read`, {} /*, { headers }*/);
  }

  markAllAsRead(): Observable<any> {
    // const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/read-all`, {} /*, { headers }*/);
  }
}