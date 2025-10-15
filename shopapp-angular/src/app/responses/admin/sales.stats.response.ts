export interface SalesStatsResponse {
  totalSales: string;
  salesByPaymentMethod: { [key: string]: string }; // Thay đổi kiểu dữ liệu
}