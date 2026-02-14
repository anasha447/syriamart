package com.syriamart.commercial.dto.response.product;

import java.util.List;

public record ProductVariationResponse(String id, String name, List<VariationOptionResponse> options) {
}
