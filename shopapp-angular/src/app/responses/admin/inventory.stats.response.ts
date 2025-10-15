export interface InventoryStatsResponse {
  id: number;
  name: string;
  price: string; // Đã thay đổi thành string
  quantityInStock: number;
  status: string;
  categoryName: string;
}