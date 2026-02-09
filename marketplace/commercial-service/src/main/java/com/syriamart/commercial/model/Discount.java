package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import com.syriamart.commercial.model.enums.DiscountScope;
import com.syriamart.commercial.model.enums.DiscountType;

import java.math.BigDecimal;

@Entity
@Table(name = "discounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "product", "category", "seller" })
public class Discount {
    @Id
    private String id;

    private String name;
    private BigDecimal value;

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
            throw new IllegalStateException("Discount scope must be set");
        }

        boolean valid = switch (scopeType) {
            case PRODUCT -> product != null && category == null && seller == null;
            case CATEGORY -> product == null && category != null && seller == null;
            case SELLER -> product == null && category == null && seller != null;
        };

        if (!valid) {
            throw new IllegalStateException("Discount target fields must match scope type: " + scopeType);
        }
    }
}