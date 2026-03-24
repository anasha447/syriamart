package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.YearMonth;

/**
 * Monthly snapshot of a seller's performance metrics.
 * Written/updated by AnalyticsServiceImpl after order state transitions.
 * One record per (sellerId + yearMonth).
 */
@Entity
@Table(name = "seller_analytics",
       uniqueConstraints = @UniqueConstraint(columnNames = {"seller_id", "year", "month"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerAnalytics extends BaseEntity {

    @Column(name = "seller_id", nullable = false, length = 36)
    private String sellerId;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private int month;

    @Column(name = "total_orders")
    @Builder.Default
    private int totalOrders = 0;

    @Column(name = "completed_orders")
    @Builder.Default
    private int completedOrders = 0;

    @Column(name = "cancelled_orders")
    @Builder.Default
    private int cancelledOrders = 0;

    @Column(name = "returned_orders")
    @Builder.Default
    private int returnedOrders = 0;

    @Column(name = "total_revenue", precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "total_items_sold")
    @Builder.Default
    private int totalItemsSold = 0;

    @Column(name = "average_order_value", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal averageOrderValue = BigDecimal.ZERO;

    @Column(name = "average_rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    @Builder.Default
    private int totalReviews = 0;

    /** Return rate as a decimal (e.g. 0.05 = 5%). */
    @Column(name = "return_rate", precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal returnRate = BigDecimal.ZERO;

    public static SellerAnalytics forCurrentMonth(String sellerId) {
        YearMonth ym = YearMonth.now();
        return SellerAnalytics.builder()
                .sellerId(sellerId)
                .year(ym.getYear())
                .month(ym.getMonthValue())
                .build();
    }
}
