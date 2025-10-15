package com.project.shopapp.reponses.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesStatsResponse {
    private String totalSales; // Đã định dạng tiền Việt
    private Map<String, String> salesByPaymentMethod;
}