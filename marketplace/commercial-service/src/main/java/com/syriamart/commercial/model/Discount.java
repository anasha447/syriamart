package com.syriamart.commercial.model;

import com.syriamart.commercial.model.enums.DiscountScope;
import com.syriamart.commercial.model.enums.DiscountType;
import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A time-bound price reduction applied automatically (no code required).
 * Scope determines what the discount targets:
 *   PRODUCT  → specific product
 *   CATEGORY → all products in a category
 *   SELLER   → all products from a seller
 *   PLATFORM → site-wide sale
 */
@Entity
@Table(name = "discounts", indexes = {
        @Index(name = "idx_discount_seller",   columnList = "seller_id"),
        @Index(name = "idx_discount_product",  columnList = "target_product_id"),
        @Index(name = "idx_discount_category", columnList = "target_category_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Discount extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 15)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private DiscountScope scope;

    /** Populated when scope = PRODUCT. */
    @Column(name = "target_product_id", length = 36)
    private String targetProductId;

    /** Populated when scope = CATEGORY. */
    @Column(name = "target_category_id", length = 36)
    private String targetCategoryId;

    /** Populated when scope = SELLER. */
    @Column(name = "seller_id", length = 36)
    private String sellerId;

    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;

    @Column(name = "valid_to", nullable = false)
    private LocalDateTime validTo;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    public boolean isCurrentlyActive() {
        LocalDateTime now = LocalDateTime.now();
        return active && now.isAfter(validFrom) && now.isBefore(validTo);
    }
}
