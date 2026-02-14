package com.syriamart.userservice.dto.request.seller;

import jakarta.validation.constraints.*;

public record SellerProfileUpdateRequest(@Size(max = 100) String name,
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$") String phone, String profileImageUrl, String addressId) {
}
