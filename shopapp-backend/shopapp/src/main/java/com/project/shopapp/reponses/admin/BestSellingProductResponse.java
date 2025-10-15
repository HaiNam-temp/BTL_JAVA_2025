package com.project.shopapp.reponses.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.NumberFormat;
import java.util.Locale;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BestSellingProductResponse {
    private Long id;
    private String name;
    private String price;
    private Integer totalQuantitySold;
    private String categoryName;

    public void setPrice(Float price) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        this.price = formatter.format(price);
    }
}