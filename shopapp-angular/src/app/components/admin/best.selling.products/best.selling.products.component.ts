import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../../../service/admin.dashboard.service';
import { BestSellingProductResponse } from '../../../responses/admin/best.selling.product.response';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-best.selling.products',
  imports: [CommonModule, NgChartsModule, FormsModule],
  templateUrl: './best.selling.products.component.html',
  styleUrl: './best.selling.products.component.scss'
})
export class BestSellingProductsComponent implements OnInit {
  bestSellingProducts: BestSellingProductResponse[] = [];

  public barChartOptions: ChartOptions<'bar'> = { // Chỉ định loại biểu đồ
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sản phẩm'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Số lượng đã bán'
        },
        beginAtZero: true 
      }
    }
  };
  public barChartLabels: string[] = []; // Tên sản phẩm
  public barChartType: 'bar' = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartData: ChartDataset<'bar'>[] = [
    { data: [], label: 'Số lượng đã bán', backgroundColor: '#007bff' } 
  ];


  startDateInput: string = this.formatDateForInput(new Date(new Date().getFullYear(), 0, 1));
  endDateInput: string = this.formatDateForInput(new Date()); // Ngày hiện tại


  startDateQuery: string = '';
  endDateQuery: string = '';

  limit: number = 10;


  displayStartDate: string = '';
  displayEndDate: string = '';


  constructor(private adminDashboardService: AdminDashboardService) { }

  ngOnInit(): void {
    this.applyDateRangeAndLoadProducts(); 
  }


  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  applyDateRangeAndLoadProducts(): void {

    if (this.startDateInput && this.endDateInput) {
      this.startDateQuery = `${this.startDateInput}T00:00:00`;
      this.endDateQuery = `${this.endDateInput}T23:59:59`;


      this.displayStartDate = this.startDateInput;
      this.displayEndDate = this.endDateInput;

      this.loadBestSellingProducts();
    } else {
      console.warn("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");

    }
  }

  loadBestSellingProducts(): void {
    if (!this.startDateQuery || !this.endDateQuery) {
      console.error('Ngày bắt đầu hoặc kết thúc chưa được thiết lập cho query.');
      return;
    }
    this.adminDashboardService.getBestSellingProducts(this.startDateQuery, this.endDateQuery, this.limit)
      .subscribe(
        data => {
          this.bestSellingProducts = data;
          this.prepareChartData();
        },
        error => {
          console.error('Error fetching best selling products:', error);
          this.bestSellingProducts = []; // Xóa dữ liệu cũ nếu có lỗi
          this.prepareChartData(); 
        }
      );
  }

  prepareChartData(): void {
    this.barChartLabels = this.bestSellingProducts.map(product => product.name);
    this.barChartData[0].data = this.bestSellingProducts.map(product => product.totalQuantitySold || 0);
  }

  
}
