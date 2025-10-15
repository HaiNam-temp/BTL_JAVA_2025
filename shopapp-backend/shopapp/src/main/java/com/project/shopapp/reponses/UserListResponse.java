package com.project.shopapp.reponses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Date;

import java.util.List;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class UserListResponse {
    private List<UserResponse> users;
    private int totalPages;
}