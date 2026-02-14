package com.syriamart.commercial.dto.response.shared;

import com.syriamart.commercial.dto.response.address.AddressResponse;

public record PickupPointResponse(String id, String name, AddressResponse address, String contactPhone,
        boolean isActive) {
}
