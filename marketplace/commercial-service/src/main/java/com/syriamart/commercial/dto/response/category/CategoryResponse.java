package com.syriamart.commercial.dto.response.category;

public record CategoryResponse(
        String id, String name, String slug,
        String description, String imageUrl,
        boolean active, int displayOrder
) {}
