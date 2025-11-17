import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MapComponent } from '../map/map.component';
import { environment } from '../../environments/environment';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, MapComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponent implements OnInit {

  products: Product[] = [];
  hotProducts: Product[] = [];
  bestSellers: Product[] = [];
  bestPrices: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';

  // ===== SORT CHO USER =====
  sortField: string = 'id';    // id | price | createdAt
  sortDir: string = 'asc';     // asc | desc

  ngOnInit() {
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(1, 100);
  }

  private buildImageUrl(raw: string | null | undefined): string {
    if (!raw) return 'assets/images/no-image.jpg';
    const value = raw.trim();

    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('/images/')) return `assets${value}`;
    if (value.startsWith('images/')) return `assets/${value}`;

    return `${environment.apiBaseUrl}/products/images/${value}`;
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.categories = apiResponse.data;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi tải danh sách sản phẩm',
          title: 'Lỗi Tải Dữ Liệu'
        });
      }
    });
  }

  // khi user đổi sort
  onSortChange() {
    this.currentPage = 1;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }

  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 6;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    this.productService.getProducts(
      keyword,
      selectedCategoryId,
      page,
      limit,
      this.sortField,   // gửi sort
      this.sortDir
    ).subscribe({
      next: (response: any) => {
        response.products.forEach((product: Product) => {
          const img =
            product.thumbnail ||
            product.product_images?.[0]?.image_url ||
            '';
          product.url = this.buildImageUrl(img);
        });

        this.products = response.products;

        this.bestSellers = this.products.slice(2, 6);
        this.bestPrices = this.products.filter(p => +p.price < 10000000).slice(0, 3);

        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  override generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages)
      start = Math.max(end - maxVisiblePages + 1, 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  onProductClick(productId: number) {
    this.router.navigate(['/products', productId]);
  }
}
