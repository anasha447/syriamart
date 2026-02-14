package com.syriamart.logistics.dto.response.pickuppoint;

import com.syriamart.logistics.dto.response.address.AddressResponse;

public record PickupPointResponse(String id, String name, AddressResponse address, String contactPhone,
        boolean isActive) {
}
