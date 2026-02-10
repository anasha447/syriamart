package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;
import com.syriamart.logistics.model.enums.OrderStatus;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "order_status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class OrderStatusHistory extends BaseEntity {

    private String note;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private OrderStatus status;

    @Column(name = "order_id")
    @ToString.Include
    private String orderId;
}
