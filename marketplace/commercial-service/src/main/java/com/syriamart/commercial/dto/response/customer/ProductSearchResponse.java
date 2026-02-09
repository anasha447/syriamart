package com.syriamart.commercial.dto.response.customer;

import java.util.List;
import java.util.Map;

public record ProductSearchResponse(List<ProductCatalogResponse> products, String searchTerm, int totalResults,
        Map<String, Integer> categoryFacets) {
}
