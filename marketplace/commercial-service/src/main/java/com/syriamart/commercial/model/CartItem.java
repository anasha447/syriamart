package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * A single product line inside a Cart.
 * unitPrice is snapshotted at add-to-cart time and re-validated at checkout.
 */
@Entity
@Table(name = "cart_items", indexes = {
        @Index(name = "idx_ci_cart",    columnList = "cart_id"),
        @Index(name = "idx_ci_product", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @Column(name = "product_id", nullable = false, length = 36)
    private String productId;

    /** Null when product has no variations. */
    @Column(name = "variation_value_id", length = 36)
    private String variationValueId;

    @Column(nullable = false)
    private int quantity;

    /** Price snapshot at the moment this item was added. */
    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;
}
