package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * A variation axis on a product (e.g. "Color", "Storage", "Size").
 * Multiple axes are supported per product.
 */
@Entity
@Table(name = "product_variations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /** The axis label shown to the customer (e.g. "Color"). */
    @Column(nullable = false, length = 60)
    private String name;

    @Column(name = "display_order")
    @Builder.Default
    private int displayOrder = 0;

    /** Concrete values for this axis (e.g. "Red", "Blue"). */
    @OneToMany(mappedBy = "variation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VariationOption> options = new ArrayList<>();
}
