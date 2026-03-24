package com.syriamart.commercial.dto.response.address;

public record AddressResponse(
        String fullName, String phone,
        String addressLine1, String addressLine2,
        String city, String governorate
) {}
