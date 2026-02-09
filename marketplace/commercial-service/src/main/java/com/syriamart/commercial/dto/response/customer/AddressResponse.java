package com.syriamart.commercial.dto.response.customer;

public record AddressResponse(String id, String addressLine1, String addressLine2, String city, String state,
        String postalCode, String country, String type) {
}
