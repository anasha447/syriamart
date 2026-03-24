package com.syriamart.commercial.dto.response.wishlist;

import java.util.List;

public record WishlistResponse(
        String id, String name, boolean defaultList,
        List<WishlistItemResponse> items
) {}
