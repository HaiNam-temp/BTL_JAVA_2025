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

  // ====== HÀM BUILD URL ẢNH DÙNG CHUNG ======
  private buildImageUrl(raw: string | null | undefined): string {
    if (!raw) {
      return 'assets/images/no-image.jpg';
    }

    const value = raw.trim();

    // 1. Link ngoài
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    // 2. Ảnh trong FE assets: /images/...
    if (value.startsWith('/images/')) {
      return `assets${value}`; // assets/images/...
    }
    if (value.startsWith('images/')) {
      return `assets/${value}`;
    }

    // 3. Mặc định: tên file trong uploads của backend
    return `${environment.apiBaseUrl}/products/images/${value}`;
  }

  ngOnInit() {
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam !== undefined && !isNaN(+idParam)) {
        this.productId = +idParam;
        this.loadProduct(this.productId);
      } else {
        console.error('Invalid productId:', idParam);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadProduct(productId: number) {
    this.productService.getDetailProduct(productId).subscribe({
      next: (response: any) => {
        this.product = response.data;

        if (this.product) {
          // Xử lý ảnh chi tiết sản phẩm
          if (this.product.product_images && this.product.product_images.length > 0) {
            this.product.product_images.forEach((img: ProductImage) => {
              img.image_url = this.buildImageUrl(img.image_url);
            });
          }

          // Nếu cần thumbnail riêng
          if ((this.product as any).thumbnail) {
            (this.product as any).thumbnail =
              this.buildImageUrl((this.product as any).thumbnail);
          }

          this.product.quantityInStock = this.product.quantityInStock || 0;
          (this.product as any).soldQuantity = Math.floor(Math.random() * 500) + 1;

          if (this.product.category_id) {
            this.loadRelatedProducts(this.product.category_id);
          }
        }

        this.showImage(0);
      },
      error: (error: any) => {
        console.error('Error fetching detail:', error);
      }
    });
  }

  loadRelatedProducts(categoryId: number): void {
    this.productService.getProducts('', categoryId, 1, 4).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.products)) {
          response.products.forEach((product: Product) => {
            const img =
              product.product_images?.[0]?.image_url ||
              product.thumbnail ||
              '';

            product.url = this.buildImageUrl(img);
          });

          // Lọc bỏ sản phẩm hiện tại
          this.relatedProducts = response.products.filter(
            (p: Product) => p.id !== this.product?.id
          );
        } else {
          this.relatedProducts = [];
        }
      },
      error: (error: any) => {
        console.error('Error loading related products:', error);
      },
      complete: () => {}
    });
  }

  showImage(index: number): void {
    if (this.product && this.product.product_images &&
        this.product.product_images.length > 0) {

      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    if (!this.product) {
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
      return;
    }

    if (this.product.quantityInStock !== undefined &&
        this.quantity > this.product.quantityInStock) {

      this.toastService.showToast({
        error: 'Số lượng đặt mua vượt quá tồn kho',
        defaultMsg: 'Số lượng đặt mua vượt quá tồn kho',
        title: 'Lỗi Giỏ Hàng'
      });
      return;
    }

    this.isPressedAddToCart = true;
    this.toastService.showToast({
      defaultMsg: 'Thêm vào giỏ hàng thành công',
      title: 'Giỏ Hàng'
    });
    this.cartService.addToCart(this.product.id, this.quantity);
  }

  increaseQuantity(): void {
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

    if (this.product.quantityInStock !== undefined &&
        this.quantity > this.product.quantityInStock) {

      this.toastService.showToast({
        error: 'Số lượng đặt mua vượt quá tồn kho',
        defaultMsg: 'Số lượng đặt mua vượt quá tồn kho',
        title: 'Lỗi Giỏ Hàng'
      });
      return;
    }

    if (!this.isPressedAddToCart) {
      this.addToCart();
    }

    this.router.navigate(['/orders']);
  }

  onProductClick(productId: number) {
    this.router.navigate(['/products', productId]);
  }
}
