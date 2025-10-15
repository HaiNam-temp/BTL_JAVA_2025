import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../../../service/admin.dashboard.service';
import { SalesStatsResponse } from '../../../responses/admin/sales.stats.response';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales.stats',
  imports: [CommonModule, NgChartsModule, FormsModule],
  templateUrl: './sales.stats.component.html',
  styleUrl: './sales.stats.component.scss'
})
export class SalesStatsComponent implements OnInit {
  salesStats: SalesStatsResponse = { totalSales: '', salesByPaymentMethod: {} };

  public pieChartOptions: ChartOptions<'pie'> = { // Giữ nguyên chỉ định loại biểu đồ cho Options
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              const value = parseFloat(context.raw as string);
              const formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0
              });
              label += formatter.format(value);
            }
            return label;
          }
        }
      }
    }
  };
  public pieChartLabels: string[] = [];
  public pieChartData: ChartDataset<'pie'>[] = [{ data: [] }]; // Giữ nguyên chỉ định loại biểu đồ cho Dataset

  public pieChartType: 'pie' = 'pie'; // Chỉ định rõ ràng kiểu "pie" là một literal type


  public pieChartLegend = true;

  startDateInput: string = this.formatDateForInput(new Date(new Date().getFullYear(), 0, 1)); // Ngày đầu năm hiện tại
  endDateInput: string = this.formatDateForInput(new Date()); // Ngày hiện tại

  // Các giá trị sẽ được gửi đi API (YYYY-MM-DDTHH:mm:ss)
  startDateQuery: string = '';
  endDateQuery: string = '';

  // Hiển thị ngày tháng trên giao diện (sau khi đã load)
  displayStartDate: string = '';
  displayEndDate: string = '';

  constructor(private adminDashboardService: AdminDashboardService) { }

  ngOnInit(): void {
    this.applyDateRangeAndLoadStats(); // Load dữ liệu lần đầu với ngày mặc định
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  applyDateRangeAndLoadStats(): void {
    if (this.startDateInput && this.endDateInput) {
      this.startDateQuery = `${this.startDateInput}T00:00:00`;
      this.endDateQuery = `${this.endDateInput}T23:59:59`;

      this.displayStartDate = this.startDateInput;
      this.displayEndDate = this.endDateInput;

      this.loadSalesStats();
    } else {
      console.warn("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      // Hiển thị thông báo cho người dùng nếu cần
    }
  }

  loadSalesStats(): void {
    if (!this.startDateQuery || !this.endDateQuery) {
      console.error('Ngày bắt đầu hoặc kết thúc chưa được thiết lập cho query.');
      return;
    }
    this.adminDashboardService.getSalesStats(this.startDateQuery, this.endDateQuery).subscribe(
      data => {
        this.salesStats = data;
        this.prepareChartData();
      },
      error => {
        console.error('Error fetching sales stats:', error);
        this.salesStats = { totalSales: '0 đ', salesByPaymentMethod: {} }; // Reset về giá trị mặc định an toàn
        this.prepareChartData(); // Cập nhật biểu đồ (sẽ trống hoặc hiển thị 0)
      }
    );
  }

  prepareChartData(): void {
    debugger
    this.pieChartLabels = Object.keys(this.salesStats.salesByPaymentMethod || {});
    this.pieChartData[0].data = this.pieChartLabels.map(key => {
      const formattedValue = this.salesStats.salesByPaymentMethod[key];
      const numericString = formattedValue ? String(formattedValue).replace(/[^\d]/g, '') : '0';
      return parseFloat(numericString) || 0; // Đảm bảo trả về số, hoặc 0 nếu không parse được
    });
     // Cập nhật tổng doanh số để đảm bảo nó được hiển thị đúng nếu API trả về chuỗi rỗng hoặc null
    if (!this.salesStats.totalSales) {
        this.salesStats.totalSales = "0 đ";
    }
  }
}
