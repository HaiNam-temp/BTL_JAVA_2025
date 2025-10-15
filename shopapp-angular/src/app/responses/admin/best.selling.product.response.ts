export interface BestSellingProductResponse {
  id: number;
  name: string;
  price: string; // Đã thay đổi thành string
  totalQuantitySold: number;
  categoryName: string;
}