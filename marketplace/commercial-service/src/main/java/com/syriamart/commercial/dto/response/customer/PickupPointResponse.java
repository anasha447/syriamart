package com.syriamart.commercial.dto.response.customer;

public record PickupPointResponse(String id, String name, AddressResponse address, String contactPhone,
        boolean isActive) {
}
