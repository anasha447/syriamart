package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * A concrete value for a ProductVariation axis (e.g. "Red" for "Color").
 */
@Entity
@Table(name = "variation_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariationOption extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "variation_id", nullable = false)
    private ProductVariation variation;

    /** Display value (e.g. "Red", "XL"). */
    @Column(nullable = false, length = 80)
    private String value;

    /**
     * Optional hex color code for swatch rendering.
     * Only meaningful when the variation axis represents color.
     */
    @Column(name = "color_hex", length = 7)
    private String colorHex;

    @Column(name = "display_order")
    @Builder.Default
    private int displayOrder = 0;
}
