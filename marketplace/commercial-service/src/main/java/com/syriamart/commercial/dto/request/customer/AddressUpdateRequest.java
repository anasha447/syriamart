package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.Size;

public record AddressUpdateRequest(@Size(max = 200) String addressLine1, @Size(max = 200) String addressLine2,
        @Size(max = 100) String city, @Size(max = 100) String state, @Size(max = 20) String postalCode) {
}
