package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "product_variation_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"product", "variationOption", "cartItems"})
public class ProductVariationValue {
    @Id
    private String id;
    
    private Integer stock;
    private BigDecimal priceOverride;
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