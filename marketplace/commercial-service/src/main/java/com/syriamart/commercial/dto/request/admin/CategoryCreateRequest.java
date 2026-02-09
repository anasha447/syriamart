package com.syriamart.commercial.dto.request.admin;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CategoryCreateRequest(
        @NotBlank @Size(max = 100) String name,
        @Size(max = 500) String description,
        String parentCategoryId,
        @DecimalMin("0") @DecimalMax("100") BigDecimal adminProfitPercentage) {
}
