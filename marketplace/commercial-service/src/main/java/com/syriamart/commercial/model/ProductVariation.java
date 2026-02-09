package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Entity
@Table(name = "product_variations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class ProductVariation extends BaseEntity {

    @ToString.Include
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @OneToMany(mappedBy = "variation", fetch = FetchType.LAZY)
    private List<VariationOption> variationOptions;
}
