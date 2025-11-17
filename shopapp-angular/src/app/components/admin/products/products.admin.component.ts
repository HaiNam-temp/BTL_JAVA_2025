import { Component, Inject, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { environment } from '../../../environments/environment';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-admin',
  templateUrl: './products.admin.component.html',
  styleUrls: ['./products.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class ProductsAdminComponent implements OnInit {
  products: Product[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 0;       // admin dùng 0-based
  itemsPerPage: number = 6;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  localStorage?: Storage;

  sortField: string = 'id';      // 'id' | 'price' | 'createdAt'
  sortDir: string = 'asc';       // 'asc' | 'desc'

  constructor(
    private productService: ProductService,
    private router: Router,
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit() {
    this.currentPage = Number(this.localStorage?.getItem('currentProductAdminPage')) || 0;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  // ===== HÀM XỬ LÝ URL ẢNH DÙNG CHUNG =====
  private buildImageUrl(raw: string | null | undefined): string {
    if (!raw) {
      return 'assets/images/no-image.jpg';
    }

    const value = raw.trim();

    // 1. Link ngoài (http/https)
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    // 2. Ảnh static trong FE: /images/... hoặc images/...
    if (value.startsWith('/images/')) {
      return `assets${value}`;          // => assets/images/...
    }
    if (value.startsWith('images/')) {
      return `assets/${value}`;
    }

    // 3. Mặc định: tên file trong thư mục uploads của backend
    return `${environment.apiBaseUrl}/products/images/${value}`;
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 6;
    this.getProducts(
      this.keyword.trim(),
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }

  // ===== gọi khi đổi sortField / sortDir =====
  onSortChange() {
    this.currentPage = 0;
    this.getProducts(
      this.keyword.trim(),
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    // backend đang dùng page = 1-based nên FE gửi page + 1
    this.productService.getProducts(
      keyword,
      selectedCategoryId,
      page + 1,
      limit,
      this.sortField,   // gửi sortField xuống backend
      this.sortDir      // gửi sortDir xuống backend
    ).subscribe({
      next: (response: any) => {
        response.products.forEach((product: Product) => {
          // ƯU TIÊN thumbnail cho khớp với DB, sau đó mới product_images[0]
          const img =
            product.thumbnail ||
            product.product_images?.[0]?.image_url ||
            '';

          product.url = this.buildImageUrl(img);
        });

        this.products = response.products;
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
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductAdminPage', String(this.currentPage));
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(currentPage - half, 0);
    let end = Math.min(start + maxVisiblePages - 1, totalPages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 0);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  insertProduct() {
    this.router.navigate(['/admin/products/insert']);
  }

  updateProduct(productId: number) {
    this.router.navigate(['/admin/products/update', productId]);
  }

  deleteProduct(product: Product) {
    const confirmation = window.confirm('Are you sure you want to delete this product?');
    if (confirmation) {
      this.productService.deleteProduct(product.id).subscribe({
        next: (response: any) => {
          alert('Xóa thành công');
          location.reload();
        },
        complete: () => {},
        error: (error: any) => {
          alert(error.error);
          console.error('Error deleting product:', error);
        }
      });
    }
  }
}
