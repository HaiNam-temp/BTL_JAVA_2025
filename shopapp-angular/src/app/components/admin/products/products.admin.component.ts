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
  styleUrls: [
    './products.admin.component.scss',        
  ],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})
export class ProductsAdminComponent implements OnInit {
    products: Product[] = [];    
    selectedCategoryId: number  = 0; // Giá trị category được chọn
    currentPage: number = 0;
    itemsPerPage: number = 12;
    pages: number[] = [];
    totalPages:number = 0;
    visiblePages: number[] = [];
    keyword:string = "";
    localStorage?:Storage;

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
      this.getProducts(this.keyword, 
        this.selectedCategoryId, 
        this.currentPage, this.itemsPerPage);      
    }    
    searchProducts() {
      this.currentPage = 0;
      this.itemsPerPage = 12;
      //Mediocre Iron Wallet
      debugger
      this.getProducts(this.keyword.trim(), this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
    getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
      debugger
      this.productService.getProducts(keyword, selectedCategoryId, page + 1, limit).subscribe({
        next: (response: any) => {
          debugger
          response.products.forEach((product: Product) => {                      
            if (product.product_images?.length > 0) {
              product.url = `${environment.apiBaseUrl}/products/images/${product.product_images[0].image_url}`;
            } else if (product.thumbnail) {
              product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
            } else {
              product.url = 'assets/images/no-image.jpg'; // fallback ảnh mặc định
            }

          });
          this.products = response.products;
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
    
    
    
    // Hàm xử lý sự kiện khi thêm mới sản phẩm
    insertProduct() {
      debugger
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/admin/products/insert']);
    } 

    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    updateProduct(productId: number) {
      debugger
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/admin/products/update', productId]);
    }  
    deleteProduct(product: Product) {      
      const confirmation = window
      .confirm('Are you sure you want to delete this product?');
      if (confirmation) {
        debugger
        this.productService.deleteProduct(product.id).subscribe({
          next: (response: any) => {
            debugger 
            alert('Xóa thành công')
            location.reload();          
          },
          complete: () => {
            debugger;          
          },
          error: (error: any) => {
            debugger;
            alert(error.error)
            console.error('Error fetching products:', error);
          }
        });  
      }      
    }      
}
