package com.syriamart.userservice.dto.request.seller;

import jakarta.validation.constraints.*;

public record SellerRegistrationRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotBlank @Size(max = 100) String fullName,
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$") String phone,
        @NotBlank @Size(max = 100) String storeName,
        @NotBlank @Size(max = 255) String storeLocation,
        @NotBlank @Size(max = 50) String productType
) {
}
