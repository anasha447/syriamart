package com.syriamart.commercial.model;

import com.syriamart.commercial.model.enums.DiscountType;
import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Promotional coupon code applied at checkout.
 * sellerId == null  → platform-wide coupon (admin-issued).
 * sellerId != null  → seller-specific coupon valid only for that seller's items.
 */
@Entity
@Table(name = "coupons", indexes = {
        @Index(name = "idx_coupon_code",   columnList = "code", unique = true),
        @Index(name = "idx_coupon_seller", columnList = "seller_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon extends BaseEntity {

    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @Column(length = 200)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 15)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    /** Minimum order subtotal required to use the coupon. */
    @Column(name = "min_order_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal minOrderAmount = BigDecimal.ZERO;

    /** Cap on discount amount (relevant for PERCENTAGE type). */
    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;

    @Column(name = "valid_to", nullable = false)
    private LocalDateTime validTo;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "usage_count", nullable = false)
    @Builder.Default
    private int usageCount = 0;

    @Column(name = "per_user_limit")
    @Builder.Default
    private int perUserLimit = 1;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    /** Null for platform-wide coupons. */
    @Column(name = "seller_id", length = 36)
    private String sellerId;

    // ── Business helpers ─────────────────────────────────────────────────────

    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return active
               && now.isAfter(validFrom)
               && now.isBefore(validTo)
               && (usageLimit == null || usageCount < usageLimit);
    }

    public BigDecimal computeDiscount(BigDecimal subtotal) {
        if (subtotal.compareTo(minOrderAmount) < 0) return BigDecimal.ZERO;
        BigDecimal discount;
        if (discountType == DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(discountValue).divide(BigDecimal.valueOf(100));
            if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
                discount = maxDiscountAmount;
            }
        } else {
            discount = discountValue.min(subtotal);
        }
        return discount;
    }
}
