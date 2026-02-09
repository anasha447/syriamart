package com.syriamart.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.project.model.enums.OrderStatus;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class OrderStatusHistory {
    @Id
    private String id;

    private String note;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @CreationTimestamp
    private LocalDateTime changedAt;

    @Column(name = "order_id")
    private String orderId;
}