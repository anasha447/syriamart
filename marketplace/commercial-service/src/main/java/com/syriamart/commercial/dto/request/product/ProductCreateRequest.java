package com.syriamart.commercial.dto.request.product;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public record ProductCreateRequest(
        @NotBlank @Size(max = 200) String name,
        @Size(max = 5000) String description,
        @NotNull @DecimalMin("0.00") BigDecimal basePrice,
        @Min(0) int stockQuantity,
        @NotBlank String categoryId,
        String subCategoryId,
        @Size(max = 500) String tags,
        List<ProductVariationRequest> variations
) {}
