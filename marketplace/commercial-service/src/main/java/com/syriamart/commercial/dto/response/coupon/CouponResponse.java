package com.syriamart.commercial.dto.response.coupon;

import com.syriamart.commercial.model.enums.DiscountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CouponResponse(
        String id, String code, String description,
        DiscountType discountType, BigDecimal discountValue,
        BigDecimal minOrderAmount, BigDecimal maxDiscountAmount,
        LocalDateTime validFrom, LocalDateTime validTo,
        Integer usageLimit, int usageCount,
        int perUserLimit, boolean active, String sellerId
) {}
