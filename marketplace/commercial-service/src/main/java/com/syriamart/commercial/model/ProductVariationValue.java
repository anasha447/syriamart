package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "product_variation_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class ProductVariationValue extends BaseEntity {

    @ToString.Include
    private Integer stock;

    @ToString.Include
    private BigDecimal priceOverride;

    @ToString.Include
    private String sku;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variation_option_id")
    @JsonIgnore
    private VariationOption variationOption;

    @OneToMany(mappedBy = "variationValue", fetch = FetchType.LAZY)
    private List<CartItem> cartItems;
}
