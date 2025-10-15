package com.project.shopapp.services;

import com.project.shopapp.models.Product;
import com.project.shopapp.reponses.admin.BestSellingProductResponse;
import com.project.shopapp.reponses.admin.InventoryStatsResponse;
import com.project.shopapp.reponses.admin.SalesStatsResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface IAdminDashboardService {
    List<InventoryStatsResponse> getInventoryStats();

    List<BestSellingProductResponse> getBestSellingProducts(LocalDateTime startDate, LocalDateTime endDate, int limit);

    SalesStatsResponse getSalesStats(LocalDateTime startDate, LocalDateTime endDate);
}
