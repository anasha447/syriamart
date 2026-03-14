package com.syriamart.userservice.dto.request.address;

import jakarta.validation.constraints.*;

public record AddressCreateRequest(
        @NotBlank @Size(max = 200) String addressLine1,
        @Size(max = 200) String addressLine2,
        @NotBlank @Size(max = 100) String city,
        @NotBlank @Size(max = 100) String state,
        @NotBlank @Size(max = 20) String postalCode,
        @NotBlank @Size(max = 100) String country,
        @NotBlank @Pattern(regexp = "HOME|WORK", message = "Type must be HOME, WORK, or PICKUP_POINT") String type
) {
}