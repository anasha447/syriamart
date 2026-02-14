package com.syriamart.commercial.dto.request.product;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record ProductCreateRequest(@NotBlank @Size(max = 200) String name,
        @NotBlank @Size(max = 2000) String description, @NotNull String categoryId,
        @NotNull @DecimalMin("0.01") BigDecimal price, @NotNull @Min(0) Integer stock,
        @NotBlank @Size(max = 50) String sku, String mainImageUrl, List<ProductImageRequest> additionalImages,
        List<ProductVariationRequest> variations) {
}
