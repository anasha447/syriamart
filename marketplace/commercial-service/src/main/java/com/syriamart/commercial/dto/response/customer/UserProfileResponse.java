package com.syriamart.commercial.dto.response.customer;

import java.time.LocalDateTime;
import java.util.List;

public record UserProfileResponse(String id, String email, String fullName, String phone,
        List<AddressResponse> addresses, int orderCount, int reviewCount, LocalDateTime createdAt) {
}
