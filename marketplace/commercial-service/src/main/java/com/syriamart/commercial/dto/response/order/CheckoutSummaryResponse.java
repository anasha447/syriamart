package com.syriamart.commercial.dto.response.order;

import com.syriamart.commercial.dto.response.address.AddressResponse;
import java.math.BigDecimal;

public record CheckoutSummaryResponse(BigDecimal subtotal, BigDecimal discountAmount, BigDecimal shippingFee,
        BigDecimal total, int itemCount, AddressResponse deliveryAddress, String paymentMethod) {
}
