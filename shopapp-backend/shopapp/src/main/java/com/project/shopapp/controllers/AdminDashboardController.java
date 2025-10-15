package com.project.shopapp.controllers;

import com.project.shopapp.models.Product;
import com.project.shopapp.reponses.admin.BestSellingProductResponse;
import com.project.shopapp.reponses.admin.InventoryStatsResponse;
import com.project.shopapp.reponses.admin.SalesStatsResponse;
import com.project.shopapp.services.IAdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final IAdminDashboardService adminDashboardService;

    @GetMapping("/inventory-stats")
    public ResponseEntity<List<InventoryStatsResponse>> getInventoryStats() { // Update response type
        return ResponseEntity.ok(adminDashboardService.getInventoryStats());
    }

    @GetMapping("/best-selling-products")
    public ResponseEntity<List<BestSellingProductResponse>> getBestSellingProducts(
            @RequestParam(value = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(value = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(value = "limit", defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(adminDashboardService.getBestSellingProducts(startDate, endDate, limit));
    }

    @GetMapping("/sales-stats")
    public ResponseEntity<SalesStatsResponse> getSalesStats( // Thay đổi kiểu trả về
                                                             @RequestParam(value = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                                                             @RequestParam(value = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return ResponseEntity.ok(adminDashboardService.getSalesStats(startDate, endDate)); // Gọi service và trả về Map<String, Object>
    }
}