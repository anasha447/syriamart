package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * A persistent shopping cart, one per customer.
 * One cart is created lazily on first add-to-cart.
 */
@Entity
@Table(name = "carts", indexes = {
        @Index(name = "idx_cart_customer", columnList = "customer_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart extends BaseEntity {

    @Column(name = "customer_id", nullable = false, unique = true, length = 36)
    private String customerId;

    /** The coupon code the customer has applied to this cart. */
    @Column(name = "applied_coupon_code", length = 30)
    private String appliedCouponCode;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();
}
