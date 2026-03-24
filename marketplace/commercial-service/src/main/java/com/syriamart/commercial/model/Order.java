package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;
import com.syriamart.common.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * A customer's purchase transaction, potentially spanning multiple sellers.
 * Each seller's items are tracked via OrderItem.status (OrderItemStatus).
 *
 * customerId is the UUID from user-service — no FK constraint here.
 */
@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_order_customer", columnList = "customer_id"),
        @Index(name = "idx_order_status",   columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {

    @Column(name = "customer_id", nullable = false, length = 36)
    private String customerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    // ── Address snapshot (denormalized at checkout time) ────────────────────
    @Column(name = "shipping_full_name", length = 120)
    private String shippingFullName;

    @Column(name = "shipping_phone", length = 20)
    private String shippingPhone;

    @Column(name = "shipping_address_line1", length = 200)
    private String shippingAddressLine1;

    @Column(name = "shipping_address_line2", length = 200)
    private String shippingAddressLine2;

    @Column(name = "shipping_city", length = 80)
    private String shippingCity;

    @Column(name = "shipping_governorate", length = 80)
    private String shippingGovernorate;

    // ── Pricing ─────────────────────────────────────────────────────────────
    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "shipping_fee", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;

    @Column(name = "coupon_code", length = 30)
    private String couponCode;

    @Column(length = 500)
    private String notes;

    /** Populated when the logistics service confirms shipment. */
    @Column(name = "tracking_number", length = 80)
    private String trackingNumber;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    // ── Computed helpers ─────────────────────────────────────────────────────
    public BigDecimal recalculateTotal() {
        this.total = subtotal.subtract(discountAmount).add(shippingFee);
        return this.total;
    }
}
