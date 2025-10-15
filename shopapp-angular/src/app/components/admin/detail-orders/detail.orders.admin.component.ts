import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderService } from '../../../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { OrderDTO } from '../../../dtos/order/order.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../service/toast.service';


@Component({
  selector: 'app-detail-orders-admin',
  imports: [FormsModule, CommonModule],
  templateUrl: './detail.orders.admin.component.html',
  styleUrl: './detail.orders.admin.component.scss'
})
export class DetailOrdersAdminComponent implements OnInit{    
  orderId:number = 0;
  orderResponse: OrderResponse = {
    id: 0, 
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0, 
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: [],
    
  };
  isDownloadingInvoice: boolean = false;  
  constructor(
    private orderService: OrderService,
    private toastService: ToastService,

    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }
  
  getOrderDetails(): void {
    debugger
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {        
        debugger;       
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.email = response.email;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.address = response.address; 
        this.orderResponse.note = response.note;
        this.orderResponse.total_money = response.total_money;
        if (response.order_date) {
          this.orderResponse.order_date = new Date(
            response.order_date[0], 
            response.order_date[1] - 1, 
            response.order_date[2]
          );        
        }        
        this.orderResponse.order_details = response.order_details
          .map((order_detail:any) => {
            order_detail.product = {
              id: order_detail.product_id,
              name: order_detail.product_name,
              price: order_detail.price,
              thumbnail: order_detail.thumbnail 
                ? `${environment.apiBaseUrl}/products/images/${order_detail.thumbnail}`
                : '',
              description: '', 
              category_id: 0,   
              url: '',
              product_images: []
            };
          
           
            order_detail.number_of_products = order_detail.number_of_products;
            order_detail.total_money = order_detail.total_money;
          
            return order_detail;
          });     
        this.orderResponse.payment_method = response.payment_method;
        if (response.shipping_date) {
          this.orderResponse.shipping_date = new Date(
            response.shipping_date[0],
            response.shipping_date[1] - 1,
            response.shipping_date[2]
          );
        }         
        this.orderResponse.shipping_method = response.shipping_method;        
        this.orderResponse.status = response.status;     
        debugger   
      },
      complete: () => {
        debugger;        
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });
  }    
  
  saveOrder(): void {    
    debugger    
    this.orderService
      .updateOrder(this.orderId, new OrderDTO(this.orderResponse))
      .subscribe({
      next: (response: any) => {
        debugger
    
        console.log('Order updated successfully:', response);
       
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      complete: () => {
        debugger;        
      },
      error: (error: any) => {
 
        debugger
        console.error('Error updating order:', error);
      }
    });   
  }
  downloadInvoice(): void {
    if (!this.orderResponse || !this.orderResponse.id) {
      alert('Thông tin đơn hàng không đầy đủ để xuất hóa đơn.');
      // this.toastr.warning('Thông tin đơn hàng không đầy đủ.', 'Cảnh báo');
      return;
    }

    this.isDownloadingInvoice = true; 
    const orderIdToExport = this.orderResponse.id;
    const fileName = `hoa-don-${orderIdToExport}.pdf`;

    this.orderService.exportInvoice(orderIdToExport).subscribe(
      (blob: Blob) => {
        this.isDownloadingInvoice = false; 

   
        const url = window.URL.createObjectURL(blob);


        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; 
        document.body.appendChild(a); 
        a.click(); 

    
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.toastService.showToast({
            defaultMsg: 'Tải hóa đơn thành công.',
            title: 'Thành công'
          });
        // this.toastr.success('Hóa đơn đã được tải xuống thành công.', 'Thành công');
      },
      (error: HttpErrorResponse) => { 
        this.isDownloadingInvoice = false; 
        console.error('Lỗi khi tải hóa đơn:', error);
    
        if (error.error instanceof Blob && error.error.type === "application/json") {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            try {
              debugger
              const errObj = JSON.parse(e.target.result);
              this.toastService.showToast({
                error: error,
                defaultMsg: 'Lỗi không xác định từ server.',
                title: 'Lỗi khi tải hóa đơn'
              });
            } catch (jsonError) {
              debugger
              this.toastService.showToast({
                error: error,
                defaultMsg: 'Không thể phân tích lỗi từ server.',
                title: 'Lỗi khi tải hóa đơn.'
              });
            }
            };
            reader.readAsText(error.error);
        } else {
          debugger
            this.toastService.showToast({
            error: error,
            defaultMsg: 'Lỗi khi tải hóa đơn.',
            title: 'Lỗi Tải File'
          });
        }
      }
    );
  }
}



