package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Monthly platform-wide analytics snapshot (admin view).
 */
@Entity
@Table(name = "admin_analytics",
       uniqueConstraints = @UniqueConstraint(columnNames = {"year", "month"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAnalytics extends BaseEntity {

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private int month;

    @Column(name = "total_orders")
    @Builder.Default
    private int totalOrders = 0;

    @Column(name = "total_revenue", precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "total_customers")
    @Builder.Default
    private long totalCustomers = 0;

    @Column(name = "active_sellers")
    @Builder.Default
    private int activeSellers = 0;

    @Column(name = "new_products_listed")
    @Builder.Default
    private int newProductsListed = 0;

    @Column(name = "products_pending_review")
    @Builder.Default
    private int productsPendingReview = 0;

    @Column(name = "platform_commission", precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal platformCommission = BigDecimal.ZERO;

    @Column(name = "cancelled_orders")
    @Builder.Default
    private int cancelledOrders = 0;

    @Column(name = "returned_orders")
    @Builder.Default
    private int returnedOrders = 0;
}
