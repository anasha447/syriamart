package com.syriamart.commercial.dto.response.seller;

import java.util.List;

public record ProductVariationResponse(String id, String name, List<VariationOptionResponse> options) {
}
