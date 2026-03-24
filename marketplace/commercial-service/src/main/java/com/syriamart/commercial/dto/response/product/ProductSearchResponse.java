package com.syriamart.commercial.dto.response.product;

import java.util.List;

public record ProductSearchResponse(
        String query,
        List<ProductSummaryResponse> results,
        int page, int size, long totalElements, int totalPages
) {}
