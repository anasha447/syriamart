package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * A specific purchasable SKU, defined by a combination of VariationOptions
 * across all axes.
 *
 * Example: Product = "T-Shirt", options = [Red, M] → one ProductVariationValue
 * with its own price and stock.
 */
@Entity
@Table(name = "product_variation_values", indexes = {
        @Index(name = "idx_pvv_product", columnList = "product_id"),
        @Index(name = "idx_pvv_sku",     columnList = "sku", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariationValue extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /**
     * The specific options that define this SKU.
     * Stored as a join table — no extra entity needed.
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "pvv_options",
            joinColumns = @JoinColumn(name = "pvv_id"),
            inverseJoinColumns = @JoinColumn(name = "option_id")
    )
    @Builder.Default
    private List<VariationOption> selectedOptions = new ArrayList<>();

    /**
     * Overrides the product's basePrice for this specific SKU.
     * Null means "use the product's basePrice".
     */
    @Column(name = "price_override", precision = 12, scale = 2)
    private BigDecimal priceOverride;

    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private int stockQuantity = 0;

    /** Seller-assigned SKU code. Auto-generated if blank. */
    @Column(length = 80)
    private String sku;

    @Column(name = "image_url")
    private String imageUrl;

    /** Returns the effective selling price for this SKU. */
    public BigDecimal effectivePrice(BigDecimal productBasePrice) {
        return priceOverride != null ? priceOverride : productBasePrice;
    }
}
