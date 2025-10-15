import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { TokenService } from '../../service/token.service';
import { Router } from '@angular/router';
import { ToastService } from '../../service/toast.service';
import { OrderResponse } from '../../responses/order/order.response';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-purchase-history',
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.scss'
})
export class PurchaseHistoryComponent implements OnInit {
  purchaseHistory: OrderResponse[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private orderService: OrderService,
    private tokenService: TokenService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadPurchaseHistory();
  }

  loadPurchaseHistory(): void {
    this.loading = true;
    const userId = this.tokenService.getUserId();
    console.log('User ID:', userId); // ✅ kiểm tra userId

    if (!userId) {
      this.errorMessage = 'Không tìm thấy thông tin người dùng.';
      this.loading = false;
      return;
    }

    this.orderService.getPurchaseHistory(userId).subscribe({
      next: (response) => {
        console.log('Purchase history response:', response); // ✅ log dữ liệu từ API
        this.purchaseHistory = response.data;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading purchase history:', error); // ✅ log lỗi
        this.errorMessage = 'Lỗi khi tải lịch sử mua hàng.';
        this.loading = false;
      }
    });
  }


  cancelOrder(orderId: number): void {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: (response) => {
          this.toastService.showToast({
            error: null,
            defaultMsg: 'Đơn hàng đã được hủy thành công.',
            title: 'Thành công'
          });
          this.loadPurchaseHistory(); // Tải lại lịch sử sau khi hủy
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.showToast({
            error: error,
            defaultMsg: 'Lỗi khi hủy đơn hàng',
            title: 'Lỗi'
          });
        }
      });
    }
  }

  viewOrderDetails(orderId: number): void {
    // Chuyển đến trang chi tiết đơn hàng (nếu có)
    this.router.navigate(['/orders', orderId]);
  }

  canCancelOrder(status: string): boolean {
  const validStatuses = ['PENDING', 'pending', 'Chờ xác nhận'];
  return validStatuses.includes(status.trim());
}

}
