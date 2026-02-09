package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.commercial.model.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Product extends BaseEntity {

    @ToString.Include
    private String name;

    private String description;

    @ToString.Include
    private BigDecimal price;

    @ToString.Include
    private Integer stock;

    @ToString.Include
    private String sku;

    private String mainImageUrl;

    @ToString.Include
    private Boolean adminApproved;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private ProductStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    @JsonIgnore
    private Seller seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private SubCategory subCategory;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;
}
