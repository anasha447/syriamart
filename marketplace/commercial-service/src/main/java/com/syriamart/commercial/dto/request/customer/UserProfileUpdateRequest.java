package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.*;

public record UserProfileUpdateRequest(@Size(max = 100) String fullName,
        @Pattern(regexp = "^\\\\+?[1-9]\\\\d{1,14}$") String phone, String defaultAddressId) {
}
