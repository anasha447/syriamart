package com.syriamart.commercial.model;

import com.syriamart.commercial.model.enums.OrderItemStatus;
import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * A line-item inside an Order, always belonging to a single seller.
 * Critical fields are snapshotted from the product at the moment of purchase
 * so historical orders remain accurate after product edits.
 */
@Entity
@Table(name = "order_items", indexes = {
        @Index(name = "idx_oi_order",   columnList = "order_id"),
        @Index(name = "idx_oi_seller",  columnList = "seller_id"),
        @Index(name = "idx_oi_product", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_id", nullable = false, length = 36)
    private String productId;

    @Column(name = "seller_id", nullable = false, length = 36)
    private String sellerId;

    /** Nullable — null means the product has no variations. */
    @Column(name = "variation_value_id", length = 36)
    private String variationValueId;

    // ── Snapshots captured at checkout ──────────────────────────────────────
    @Column(name = "product_name_snapshot", nullable = false, length = 200)
    private String productNameSnapshot;

    /** Human-readable description of the selected variation (e.g. "Color: Red, Size: M"). */
    @Column(name = "variation_snapshot", length = 300)
    private String variationSnapshot;

    @Column(name = "image_url_snapshot")
    private String imageUrlSnapshot;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "line_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal lineTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    @Builder.Default
    private OrderItemStatus status = OrderItemStatus.PENDING;

    /** Seller's note to the logistics team for this specific item. */
    @Column(name = "seller_note", length = 300)
    private String sellerNote;

    public BigDecimal computeLineTotal() {
        this.lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        return this.lineTotal;
    }
}
