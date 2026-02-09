package com.syriamart.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.project.model.enums.ReturnRequestStatus;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "return_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "assignedDriver" })
public class ReturnRequest {
    @Id
    private String id;

    private String customerId;
    private String reason;
    private BigDecimal refundAmount;
    private String proofImageUrl;

    @Enumerated(EnumType.STRING)
    private ReturnRequestStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "order_item_id")
    private String orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_driver_id")
    @JsonIgnore
    private DeliveryProfile assignedDriver;
}