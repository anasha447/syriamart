package com.syriamart.commercial.dto.request.category;

import jakarta.validation.constraints.Size;

public record CategoryUpdateRequest(
        @Size(max = 100) String name,
        @Size(max = 500) String description,
        String imageUrl,
        Boolean active,
        Integer displayOrder
) {}
