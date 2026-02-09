package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.commercial.model.enums.OrderItemStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class OrderItem extends BaseEntity {

    @ToString.Include
    private String variationValueId;

    @ToString.Include
    private Integer quantity;

    @ToString.Include
    private BigDecimal price;

    private String discountId;
    private String couponId;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private OrderItemStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;
}
