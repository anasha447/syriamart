package com.syriamart.commercial.dto.request.order;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
        @NotBlank String shippingFullName,
        @NotBlank String shippingPhone,
        @NotBlank String deliveryAddressLine1,
        String deliveryAddressLine2,
        @NotBlank String shippingCity,
        @NotBlank String shippingGovernorate,
        String couponCode,
        String notes
) {}
