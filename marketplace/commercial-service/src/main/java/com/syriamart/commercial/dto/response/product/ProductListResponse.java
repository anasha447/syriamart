package com.syriamart.commercial.dto.response.product;

import java.util.List;

public record ProductListResponse(
        List<ProductSummaryResponse> products,
        int page, int size,
        long totalElements, int totalPages
) {}
