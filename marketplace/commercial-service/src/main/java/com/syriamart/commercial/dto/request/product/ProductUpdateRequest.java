package com.syriamart.commercial.dto.request.product;

import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductUpdateRequest(@Size(max = 200) String name, @Size(max = 2000) String description, BigDecimal price,
        Integer stock, String mainImageUrl) {
}
