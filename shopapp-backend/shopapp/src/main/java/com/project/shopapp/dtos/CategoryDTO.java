package com.project.shopapp.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class CategoryDTO {
    @NotEmpty(message = "Category's name can not be empty!")
    private String name;
}
