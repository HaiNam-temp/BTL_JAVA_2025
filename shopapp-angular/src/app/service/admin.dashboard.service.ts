import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { InventoryStatsResponse } from '../responses/admin/inventory.stats.response';
import { BestSellingProductResponse } from '../responses/admin/best.selling.product.response';
import { SalesStatsResponse } from '../responses/admin/sales.stats.response';



@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiPrefix = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getInventoryStats(): Observable<InventoryStatsResponse[]> {
    return this.http.get<InventoryStatsResponse[]>(`${this.apiPrefix}/admin/dashboard/inventory-stats`);
  }

  getBestSellingProducts(startDate: string, endDate: string, limit?: number): Observable<BestSellingProductResponse[]> {
    let params: any = { startDate, endDate };
    if (limit) {
      params.limit = limit;
    }
    return this.http.get<BestSellingProductResponse[]>(`${this.apiPrefix}/admin/dashboard/best-selling-products`, { params });
  }

  getSalesStats(startDate: string, endDate: string): Observable<SalesStatsResponse> {
    return this.http.get<SalesStatsResponse>(`${this.apiPrefix}/admin/dashboard/sales-stats`, { params: { startDate, endDate } });
  }
}