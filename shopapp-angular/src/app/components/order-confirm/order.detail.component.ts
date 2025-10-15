import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';
import { Product } from '../../models/product';
import { environment } from '../../environments/environment';
import { OrderDetail } from '../../models/order.detail';
import { OrderService } from '../../service/order.service';
import { OrderResponse } from '../../responses/order/order.response';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-order-detail',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './order.detail.component.html',
  styleUrl: './order.detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  orderId: number = 0;
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
    order_details: []
  };

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    debugger;
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

        this.orderResponse.order_details = response.order_details.map((order_detail: any) => {
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
}