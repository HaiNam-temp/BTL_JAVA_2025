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

  ngOnInit() {
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(1, 100);
  }

  // ====== HÀM BUILD URL ẢNH DÙNG CHUNG ======
  private buildImageUrl(raw: string | null | undefined): string {
    if (!raw) {
      return 'assets/images/no-image.jpg';
    }

    const value = raw.trim();

    // 1. Link ngoài (CDN, website khác) -> dùng trực tiếp
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    // 2. Đường dẫn ảnh đặt trong FE: /images/... -> trỏ vào thư mục assets
    if (value.startsWith('/images/')) {
      // DB: /images/products/smartphone_a.jpg
      // FE: assets/images/products/smartphone_a.jpg
      return `assets${value}`;
    }
    if (value.startsWith('images/')) {
      return `assets/${value}`;
    }

    // 3. Mặc định: tên file lưu trong thư mục uploads của backend
    //    DB: smartphone_a.jpg  ->  GET /products/images/smartphone_a.jpg
    return `${environment.apiBaseUrl}/products/images/${value}`;
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.categories = apiResponse.data;
      },
      complete: () => {},
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi tải danh sách sản phẩm',
          title: 'Lỗi Tải Dữ Liệu'
        });
      }
    });
  }

  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 6; // muốn trang tìm kiếm hiển thị nhiều hơn
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        // Gán URL ảnh đúng theo từng trường hợp
        response.products.forEach((product: Product) => {
          // ƯU TIÊN thumbnail cho giống DB, sau đó mới đến product_images[0]
          const img =
            product.thumbnail ||
            product.product_images?.[0]?.image_url ||
            '';

          product.url = this.buildImageUrl(img);
        });

        this.products = response.products;

        // Bán chạy: tạm thời lấy 4 sản phẩm từ vị trí 2–5 của trang hiện tại
        this.bestSellers = this.products.slice(2, 6);

        // Giá tốt: giá < 10 triệu trong trang hiện tại, tối đa 3 sp
        this.bestPrices = this.products
          .filter(p => +p.price < 10000000)
          .slice(0, 3);

        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {},
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
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }

  // Khi click sản phẩm -> chuyển sang trang chi tiết
  onProductClick(productId: number) {
    this.router.navigate(['/products', productId]);
  }
}
