package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Customer review on a product.
 * isVerifiedPurchase is true when the orderItemId points to a real DELIVERED item.
 * Only verified purchasers may leave a review; guests or non-buyers cannot.
 */
@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_product",  columnList = "product_id"),
        @Index(name = "idx_review_customer", columnList = "customer_id")
},
uniqueConstraints = {
        @UniqueConstraint(name = "uq_review_per_order_item", columnNames = "order_item_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "customer_id", nullable = false, length = 36)
    private String customerId;

    /** Links back to the specific delivery so we can verify the purchase. */
    @Column(name = "order_item_id", nullable = false, unique = true, length = 36)
    private String orderItemId;

    /** 1–5 star rating. */
    @Column(nullable = false)
    private int rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "is_verified_purchase", nullable = false)
    @Builder.Default
    private boolean verifiedPurchase = true;

    @Column(name = "is_approved", nullable = false)
    @Builder.Default
    private boolean approved = false;

    @Column(name = "seller_reply", columnDefinition = "TEXT")
    private String sellerReply;
}
