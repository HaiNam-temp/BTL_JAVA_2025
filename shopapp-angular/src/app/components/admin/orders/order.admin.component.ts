import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { OrderResponse } from '../../../responses/order/order.response';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../responses/api.response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './order.admin.component.html',
  styleUrl: './order.admin.component.scss'
})
export class OrderAdminComponent extends BaseComponent implements OnInit {
  orders_original: OrderResponse[] = [];
  orders: OrderResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = [];
  localStorage?: Storage;
  selectedStatus: string = '';
  orderStatuses: string[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  constructor() {
    super();
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit(): void {
    this.currentPage = Number(this.localStorage?.getItem('currentOrderAdminPage')) || 0;
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  searchOrders() {
    this.currentPage = 0;
    this.itemsPerPage = 10;
    this.getAllOrders(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }

  getAllOrders(keyword: string, page: number, limit: number) {
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        const responseData = apiResponse.data;
        this.orders_original = responseData.orders;
        this.totalPages = responseData.totalPages;
        console.log('Tổng số trang:', this.totalPages);
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        this.applyFilters();
        debugger
      },
      complete: () => {
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi tải danh sách đơn hàng',
          title: 'Lỗi Tải Dữ Liệu'
        });
      }
    });
  }


  applyFilters() {
    let filteredOrders = [...this.orders_original]; 

    if (this.keyword) {
      const lowerCaseKeyword = this.keyword.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.fullname.toLowerCase().includes(lowerCaseKeyword) ||
        order.email.toLowerCase().includes(lowerCaseKeyword) ||
        order.phone_number.toLowerCase().includes(lowerCaseKeyword)
       
      );
    }

    if (this.selectedStatus) {
      filteredOrders = filteredOrders.filter(order =>
        order.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

 
    this.orders = filteredOrders;

    
  }


  onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentOrderAdminPage', String(this.currentPage));

    this.getAllOrders(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }


  onStatusChange() {
    this.currentPage = 0; 
    this.applyFilters();
  }

  deleteOrder(id: number) {
    const confirmation = window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?');
    if (confirmation) {
      this.orderService.deleteOrder(id).subscribe({
        next: (response: ApiResponse) => {
          this.toastService.showToast({
            error: null,
            defaultMsg: 'Xóa đơn hàng thành công',
            title: 'Thành Công'
          });
          this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.showToast({
            error: error,
            defaultMsg: 'Lỗi khi xóa đơn hàng',
            title: 'Lỗi Xóa'
          });
        },
        complete: () => {

        },
      });
    }
  }

  viewDetails(order: OrderResponse) {
    this.router.navigate(['/admin/orders', order.id]);
  }
}