package com.syriamart.commercial.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Category extends BaseEntity {

    @ToString.Include
    private String name;

    private String description;

    @ToString.Include
    private BigDecimal adminProfitPercentage;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<SubCategory> subCategories;
}
