package com.syriamart.commercial.dto.response.customer;

import java.time.LocalDateTime;

public record WishlistResponse(String id, String name, int itemCount, LocalDateTime createdAt) {
}
