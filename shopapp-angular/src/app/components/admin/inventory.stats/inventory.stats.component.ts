import { Component, OnInit } from '@angular/core';
import { InventoryStatsResponse } from '../../../responses/admin/inventory.stats.response';
import { AdminDashboardService } from '../../../service/admin.dashboard.service';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { NgChartsModule  } from 'ng2-charts'; 

import { CommonModule } from '@angular/common'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

@Component({
  selector: 'app-inventory.stats',
  standalone: true,
  imports: [
    NgChartsModule, 
    CommonModule
  ],
  templateUrl: './inventory.stats.component.html',
  styleUrl: './inventory.stats.component.scss'
})
export class InventoryStatsComponent implements OnInit {
  products: InventoryStatsResponse[] = [];

  public barChartOptions: ChartOptions = {
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
          text: 'Số lượng tồn kho'
        }
      }
    }
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartData: ChartDataset[] = [
    { data: [], label: 'Số lượng tồn kho' }
  ];


  constructor(private adminDashboardService: AdminDashboardService) { }

  ngOnInit(): void {
    this.loadInventoryStats();
  }

  loadInventoryStats(): void {
    this.adminDashboardService.getInventoryStats().subscribe(
      data => {
        this.products = data;
        this.prepareChartData();
      },
      error => {
        console.error('Error fetching inventory stats:', error);
      }
    );
  }

  prepareChartData(): void {
    this.barChartLabels = this.products.map(product => product.name);
    this.barChartData[0].data = this.products.map(product => product.quantityInStock || 0);
  }
}