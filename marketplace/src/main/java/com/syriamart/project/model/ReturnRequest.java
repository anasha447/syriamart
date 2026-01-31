package com.syriamart.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@ToString(exclude = {"orderItem", "assignedDriver"})
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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id")
    @JsonIgnore
    private OrderItem orderItem;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_driver_id")
    @JsonIgnore
    private DeliveryProfile assignedDriver;
}