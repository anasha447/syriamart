package com.syriamart.userservice.dto.request.seller;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SellerProfileUpdateRequest(
        // Basic Info
        @Size(max = 100) String name,
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$") String phone,
        @Size(max = 500) String profileImageUrl,

        // Store Details (Added these so they can update their business info)
        @Size(max = 100) String storeName,
        @Size(max = 255) String storeLocation,
        @Size(max = 50) String productType,

        // Inline Address Fields (Added these to create/update the STORE address)
        @Size(max = 100) String city,
        @Size(max = 200) String fullAddress, // Will map to AddressLine1
        @Size(max = 200) String landmark,    // Will map to AddressLine2

        // Retained from your version (Useful if you want to update a specific address ID later)
        String addressId
) {
}