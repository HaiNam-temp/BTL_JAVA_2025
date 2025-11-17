import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product';
import { UpdateProductDTO } from '../dtos/product/update.product';
import { InsertProductDTO } from '../dtos/product/insert.product';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // 🔹 DÙNG CHUNG: user + admin
  getProducts(
    keyword: string,
    categoryId: number,
    page: number,
    limit: number,
    sortField?: string,   // thêm optional
    sortDir?: string      // thêm optional
  ): Observable<ApiResponse> {
    const params: any = {
      keyword: keyword,
      category_id: categoryId.toString(),
      page: page.toString(),
      limit: limit.toString()
    };

    // Chỉ những nơi có sort (home, admin) mới truyền
    if (sortField) {
      params.sortField = sortField;
    }
    if (sortDir) {
      params.sortDir = sortDir;
    }

    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/products`, { params });
  }

  getDetailProduct(productId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/products/${productId}`);
  }

  getProductsByIds(productIds: number[]): Observable<ApiResponse> {
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/products/by-ids`, { params });
  }

  deleteProduct(productId: number): Observable<ApiResponse> {
    // debugger  // ⬅ nếu không cần debug nữa thì xoá luôn dòng này cho đỡ bị pause
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/products/${productId}`);
  }

  updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/products/${productId}`, updatedProduct);
  }

  insertProduct(insertProductDTO: InsertProductDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/products`, insertProductDTO);
  }

  uploadImages(productId: number, files: File[]): Observable<ApiResponse> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/products/uploads/${productId}`, formData);
  }

  deleteProductImage(id: number): Observable<any> {
    // debugger  // ⬅ dòng này cũng nên xoá nếu không debug nữa
    return this.http.delete<string>(`${this.apiBaseUrl}/product_images/${id}`);
  }
}
