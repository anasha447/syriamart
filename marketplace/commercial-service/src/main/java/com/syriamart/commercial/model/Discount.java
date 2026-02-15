package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import com.syriamart.commercial.model.enums.DiscountScope;
import com.syriamart.commercial.model.enums.DiscountType;

import java.math.BigDecimal;

@Entity
@Table(name = "discounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Discount extends BaseEntity {

    @ToString.Include
    private String name;

    @ToString.Include
    private BigDecimal value;

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
            throw new IllegalStateException("Discount scope must be set");
        }

        boolean valid = switch (scopeType) {
            case PRODUCT -> product != null && category == null && sellerId == null;
            case CATEGORY -> product == null && category != null && sellerId == null;
            case SELLER -> product == null && category == null && sellerId != null;
        };

        if (!valid) {
            // throw new IllegalStateException("Discount target fields must match scope type: " + scopeType);
        }
    }
}
