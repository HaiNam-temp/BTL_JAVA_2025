import { Inject, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CategoryService } from '../../service/category.service';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { RoleService } from '../../service/role.service';
import { CartService } from '../../service/cart.service';
// import { CouponService } from '../../service/coupon.service';
import { OrderService } from '../../service/order.service';
import { Location } from '@angular/common';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ToastService } from '../../service/toast.service';
import { AuthService } from '../../service/auth.service';
import { PaymentService } from '../../service/payment.service';
import { CouponService } from '../../service/coupon.service';
// import { AuthService } from '../../service/auth.service';
// import { PaymentService } from '../../service/payment.service';

export class BaseComponent {
    toastService = inject(ToastService);
    router: Router = inject(Router);
    categoryService: CategoryService = inject(CategoryService);
    productService: ProductService = inject(ProductService);
    tokenService: TokenService = inject(TokenService);
    activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    userService: UserService = inject(UserService);
    roleService: RoleService = inject(RoleService);
    cartService: CartService = inject(CartService);
    couponService = inject(CouponService);
    orderService = inject(OrderService);
    authService = inject(AuthService);
    paymentService = inject(PaymentService);
    
    document: Document = inject(DOCUMENT);
    location: Location = inject(Location);


        
    generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
        if (totalPages <= 0) {
            return [];  // Không hiển thị phân trang nếu tổng số trang là 0
          }
        
          const maxPagesToShow = 5;
          const visiblePages = [];
          const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
          const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
        
          for (let page = startPage; page <= endPage; page++) {
            visiblePages.push(page);
          }
        
          return visiblePages;
    }
    
}


