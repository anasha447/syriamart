package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.commercial.model.enums.DiscountScope;
import com.syriamart.commercial.model.enums.DiscountType;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Coupon extends BaseEntity {

    @Column(unique = true)
    @ToString.Include
    private String code;

    @ToString.Include
    private BigDecimal value;

    @ToString.Include
    private BigDecimal minOrderAmount;

    @ToString.Include
    private Integer maxUses;

    @ToString.Include
    private Boolean active;

    @ToString.Include
    private Integer uses;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private DiscountType discountType;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private DiscountScope scopeType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;

    @Column(name = "seller_id")
    private String sellerId;

    @PrePersist
    @PreUpdate
    private void validateScope() {
        if (scopeType == null) {
            return;
        }

        // Simplified validation as sellerId is a String now
        // Assuming if scope is SELLER, sellerId must be present.
        // If PRODUCT, product must be present, etc.
        boolean valid = true;
        switch (scopeType) {
            case PRODUCT -> valid = (product != null);
            case CATEGORY -> valid = (category != null);
            case SELLER -> valid = (sellerId != null);
        }

        if (!valid) {
             // throw new IllegalStateException("Coupon target fields must match scope type: " + scopeType);
        }
    }
}
