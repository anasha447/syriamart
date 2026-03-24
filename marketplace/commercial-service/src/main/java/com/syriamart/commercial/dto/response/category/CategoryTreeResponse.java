package com.syriamart.commercial.dto.response.category;

import java.util.List;

public record CategoryTreeResponse(
        String id, String name, String slug,
        String description, String imageUrl,
        int displayOrder,
        List<SubCategoryResponse> subCategories
) {
    public record SubCategoryResponse(
            String id, String name, String slug,
            String description, String imageUrl,
            int displayOrder
    ) {}
}
