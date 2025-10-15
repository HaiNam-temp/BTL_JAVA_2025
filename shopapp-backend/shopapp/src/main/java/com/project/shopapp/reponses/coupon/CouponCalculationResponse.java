package com.project.shopapp.reponses.coupon;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.shopapp.models.Comment;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CouponCalculationResponse {
    @JsonProperty("result")
    private Double result;

    //errorCode ?
    @JsonProperty("errorMessage")
    private String errorMessage;
}
