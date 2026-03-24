package com.syriamart.commercial.dto.request.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductUpdateRequest(
        @Size(max = 200) String name,
        @Size(max = 5000) String description,
        @DecimalMin("0.00") BigDecimal basePrice,
        @Min(0) Integer stockQuantity,
        String categoryId,
        String subCategoryId,
        @Size(max = 500) String tags
) {}
