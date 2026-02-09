package com.syriamart.commercial.dto.response.seller;

import java.math.BigDecimal;

public record VariationOptionResponse(String id, String value, Integer stock, BigDecimal price, String sku) {
}
