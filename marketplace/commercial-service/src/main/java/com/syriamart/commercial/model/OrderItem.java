package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.commercial.model.enums.OrderItemStatus;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"order", "product", "returnRequests"})
public class OrderItem {
    @Id
    private String id;

    private String variationValueId;
    private Integer quantity;
    private BigDecimal price;
    private String discountId;
    private String couponId;

    @Enumerated(EnumType.STRING)
    private OrderItemStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

//    @OneToMany(mappedBy = "orderItem", fetch = FetchType.LAZY)
//    private List<ReturnRequest> returnRequests;
}