package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "variation_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"variation", "productVariationValues"})
public class VariationOption {
    @Id
    private String id;
    
    private String value;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variation_id")
    @JsonIgnore
    private ProductVariation variation;
    
    @OneToMany(mappedBy = "variationOption", fetch = FetchType.LAZY)
    private List<ProductVariationValue> productVariationValues;
}