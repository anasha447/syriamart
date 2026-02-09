package com.syriamart.commercial.dto.request.seller;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record VariationOptionRequest(@NotBlank @Size(max = 50) String value, Integer stockOverride,
        BigDecimal priceOverride, String skuSuffix) {
}
