package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Entity
@Table(name = "variation_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class VariationOption extends BaseEntity {

    @ToString.Include
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variation_id")
    @JsonIgnore
    private ProductVariation variation;

    @OneToMany(mappedBy = "variationOption", fetch = FetchType.LAZY)
    private List<ProductVariationValue> productVariationValues;
}
