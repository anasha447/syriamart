package com.syriamart.commercial.dto.response.coupon;

import com.syriamart.commercial.model.enums.DiscountScope;
import com.syriamart.commercial.model.enums.DiscountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DiscountResponse(
        String id, String name,
        DiscountType discountType, BigDecimal discountValue,
        DiscountScope scope,
        String targetProductId, String targetCategoryId, String sellerId,
        LocalDateTime validFrom, LocalDateTime validTo,
        boolean active
) {}
