package com.syriamart.commercial.dto.response.product;

import java.util.List;

/** Category-scoped product page returned to catalog/browse endpoints. */
public record ProductCatalogResponse(
        String categoryId, String categoryName,
        String subCategoryId,
        List<ProductSummaryResponse> products,
        int page, int size, long totalElements, int totalPages
) {}
