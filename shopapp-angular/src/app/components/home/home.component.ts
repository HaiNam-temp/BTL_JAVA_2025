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
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";



  ngOnInit() {
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    debugger

    this.getCategories(1, 100);
  }
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        debugger;
        this.categories = apiResponse.data;
      },
      complete: () => {
        debugger;
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
  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 12;
    debugger
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
  debugger;
  this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
    next: (response: any) => {
      debugger;
      response.products.forEach((product: Product) => {
        if (product.product_images?.length > 0 && product.product_images[0].image_url) {
   
          product.url = `${environment.apiBaseUrl}/products/images/${product.product_images[0].image_url}`;
        } else if (product.thumbnail) {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        } else {
          product.url = 'assets/images/no-image.jpg';
        }
      });
      this.products = response.products;

      this.bestSellers = this.products.slice(2, 6); 
      this.bestPrices = this.products
        .filter(p => +p.price < 10000000)  
        .slice(0, 6);

      console.log("Sản phẩm giá tốt:", this.bestPrices);
      console.log(this.products); // Kiểm tra cấu trúc dữ liệu của sản phẩm

      this.totalPages = response.totalPages;
      this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
    },
    complete: () => {
      debugger;
    },
    error: (error: any) => {
      debugger;
      console.error('Error fetching products:', error);
    }
  });
}
  onPageChange(page: number) {
    debugger;
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

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }
  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  onProductClick(productId: number) {
    debugger
    this.router.navigate(['/products', productId]);
  }


}
