package com.syriamart.commercial.model;

import com.syriamart.commercial.model.enums.ProductStatus;
import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Core product entity.
 * sellerId is a UUID string reference into user-service — no JPA join.
 */
@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_product_seller",   columnList = "seller_id"),
        @Index(name = "idx_product_status",   columnList = "status"),
        @Index(name = "idx_product_category", columnList = "category_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    /** UUID from user-service Seller entity — intentionally denormalized. */
    @Column(name = "seller_id", nullable = false, length = 36)
    private String sellerId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_category_id")
    private SubCategory subCategory;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Base/reference price. Actual selling price is on ProductVariationValue
     * when variations exist, or this field when the product has no variations.
     */
    @Column(name = "base_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    /**
     * Flat stock when no variations exist.
     * If variations are present this field is ignored — stock lives on
     * ProductVariationValue.
     */
    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private int stockQuantity = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProductStatus status = ProductStatus.PENDING_REVIEW;

    /** Populated by admin when rejecting a product. */
    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @Column(name = "average_rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    @Builder.Default
    private int totalReviews = 0;

    @Column(name = "total_sold")
    @Builder.Default
    private int totalSold = 0;

    /** Comma-separated search tags. Kept lightweight — no separate tag table needed at MVP. */
    @Column(length = 500)
    private String tags;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("isPrimary DESC, displayOrder ASC")
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    /**
     * Top-level variation axes (e.g. "Color", "Size").
     * Each axis owns the set of possible VariationOptions.
     */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductVariation> variations = new ArrayList<>();

    /**
     * Concrete SKUs: cross-product of variation options.
     * Empty when the product has no variations.
     */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductVariationValue> variationValues = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    /** True when the product has at least one active variation axis. */
    public boolean hasVariations() {
        return variations != null && !variations.isEmpty();
    }
}
