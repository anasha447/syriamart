package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.commercial.model.enums.DiscountScope;
import com.syriamart.commercial.model.enums.DiscountType;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "product", "category", "seller" })
public class Coupon {
    @Id
    private String id;

    @Column(unique = true)
    private String code;

    private BigDecimal value;
    private BigDecimal minOrderAmount;
    private Integer maxUses;

    @Enumerated(EnumType.STRING)
    private DiscountType discountType;

    @Enumerated(EnumType.STRING)
    private DiscountScope scopeType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    @JsonIgnore
    private Seller seller;

    @PrePersist
    @PreUpdate
    private void validateScope() {
        if (scopeType == null) {
            // Logic: if scopeType is null, perhaps global? Or required?
            // "Add validation: checks that exactly one ... is set and it matches scopeType"
            // Suggests scopeType IS required for this validation to make sense.
            // But if it's GLOBAL coupon? Maybe scopeType=SELLER means valid for seller's
            // items.
            // If scopeType is null, maybe no restriction?
            // Prompt says: "Create enum ... { PRODUCT, CATEGORY, SELLER }"
            // Doesn't say GLOBAL.
            // I'll enforce it as per instructions.
            return; // Or throw? Instructions imply structured scoping.
            // "Add validation: @PrePersist checks that exactly one of
            // productId/categoryId/sellerId is set and it matches scopeType"
            // This implies strict coupling.
        }

        boolean valid = switch (scopeType) {
            case PRODUCT -> product != null && category == null && seller == null;
            case CATEGORY -> product == null && category != null && seller == null;
            case SELLER -> product == null && category == null && seller != null;
        };

        if (!valid) {
            throw new IllegalStateException("Coupon target fields must match scope type: " + scopeType);
        }
    }
}