import { Injectable, Inject } from '@angular/core';
import { Product } from '../models/product';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiResponse } from '../responses/api.response';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient,private tokenService: TokenService) { }

  // Corrected function name and parameter usage
  authenticate(loginType: 'facebook' | 'google'): Observable<string> {
    debugger
    return this.http.get(
      `${this.apiBaseUrl}/users/auth/social-login?login_type=${loginType}`, 
      { responseType: 'text' }
    );
  }

  exchangeCodeForToken(code: string, loginType: 'facebook' | 'google'): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('code', code)
      .set('login_type', loginType);

    return this.http.get<any>(`${this.apiBaseUrl}/users/auth/social/callback`, { params });
  }
  isLoggedIn(): boolean {
  const token = this.tokenService.getToken();
  if (token) {
    return !this.tokenService.isTokenExpired(); // Trả về true nếu có token và token CHƯA hết hạn
  }
  return false;
}
}