package com.syriamart.commercial.dto.response.product;

import java.util.List;

public record ProductModerationQueueResponse(
        List<ProductSummaryResponse> products,
        long totalPending
) {}
