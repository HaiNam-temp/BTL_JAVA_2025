import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Product } from '../../models/product';
import { ProductImage } from '../../models/product.image';
import { environment } from '../../environments/environment';
import { CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../responses/api.response';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../base/base.component';


@Component({
  selector: 'app-detail-product',
  imports: [HeaderComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss'
})

export class DetailProductComponent extends BaseComponent implements OnInit, OnDestroy {
  private routeSub!: Subscription;
  relatedProducts: Product[] = [];
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;

  ngOnInit() {
    // Thay vì lấy snapshot, subscribe params để theo dõi thay đổi id liên tục
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam !== undefined && !isNaN(+idParam)) {
        this.productId = +idParam;
        console.log('🟨 ID sản phẩm từ URL:', this.productId);
        this.loadProduct(this.productId);
      } else {
        console.error('Invalid productId:', idParam);
      }
    });
  }

  ngOnDestroy() {
    // Hủy subscription khi component bị destroy để tránh memory leak
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadProduct(productId: number) {
    this.productService.getDetailProduct(productId).subscribe({
      next: (response: any) => {
        console.log('🟩 Response từ API:', response);
        // xử lý ảnh
        debugger
        this.product = response.data;
        if (this.product && this.product.product_images && this.product.product_images.length > 0) {
          this.product.product_images.forEach((product_image: ProductImage) => { 
            product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
          });
        }

        if (this.product) {
          this.product.quantityInStock = this.product.quantityInStock || 0; // Đảm bảo quantityInStock có giá trị
          (this.product as any).soldQuantity = Math.floor(Math.random() * 500) + 1;
          if (this.product.category_id) {
            this.loadRelatedProducts(this.product.category_id);
          }
        }
        this.showImage(0);
        console.log('🟩 Response từ API:', response);
      },
      error: (error: any) => {
        console.error('Error fetching detail:', error);
      }
    });
  }
  loadRelatedProducts(categoryId: number): void {
    debugger;
    console.log('Gọi sản phẩm liên quan với categoryId:', categoryId);

    this.productService.getProducts('', categoryId, 1, 4).subscribe({
      next: (response: any) => {
        debugger;
        console.log('Dữ liệu trả về:', response);

        if (response && Array.isArray(response.products)) {
          // Gán url cho từng product
          response.products.forEach((product: Product) => {
           if (product.product_images?.length > 0 && product.product_images[0].image_url) {
   
          product.url = `${environment.apiBaseUrl}/products/images/${product.product_images[0].image_url}`;
        } else if (product.thumbnail) {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        } else {
          product.url = 'assets/images/no-image.jpg';
        }
          });

          // Lọc bỏ sản phẩm hiện tại nếu có
          this.relatedProducts = response.products.filter((p: Product) => p.id !== this.product?.id);

          console.log('Danh sách sản phẩm liên quan:', this.relatedProducts);
        } else {
          console.warn('Dữ liệu không hợp lệ:', response);
          this.relatedProducts = [];
        }
      },
      error: (error: any) => {
        debugger;
        console.error('Error loading related products:', error);
      },
      complete: () => {
        debugger;
      }
    });
  }




  showImage(index: number): void {
    debugger
    if (this.product && this.product.product_images &&
      this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }
  addToCart(): void {
    if (!this.product) {
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
      return;
    }

    if (this.product.quantityInStock !== undefined && this.quantity > this.product.quantityInStock) {
      debugger
      this.toastService.showToast({
        error: 'Số lượng đặt mua vượt quá tồn kho',
        defaultMsg: 'Số lượng đặt mua vượt quá tồn kho',
        title: 'Lỗi Giỏ Hàng'
      });
      return; // Không cho thêm vào giỏ hàng
    }

    this.isPressedAddToCart = true;
    this.toastService.showToast({
      defaultMsg: 'Thêm vào giỏ hàng thành công',
      title: 'Giỏ Hàng'
    });
    this.cartService.addToCart(this.product.id, this.quantity);
  }

  increaseQuantity(): void {
    debugger
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  getTotalPrice(): number {
    if (this.product) {
      return this.product.price * this.quantity;
    }
    return 0;
  }
  buyNow(): void {
    if (!this.product) {
      console.error('Sản phẩm không tồn tại.');
      return;
    }

    if (this.product.quantityInStock !== undefined && this.quantity > this.product.quantityInStock) {
      this.toastService.showToast({
        error: 'Số lượng đặt mua vượt quá tồn kho',
        defaultMsg: 'Số lượng đặt mua vượt quá tồn kho',
        title: 'Lỗi Giỏ Hàng'
      });
      return; // Không cho đặt mua
    }

    if (!this.isPressedAddToCart) {
      this.addToCart();
    }

    this.router.navigate(['/orders']);
  }
  onProductClick(productId: number) {
    debugger
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/products', productId]);
  }
}
