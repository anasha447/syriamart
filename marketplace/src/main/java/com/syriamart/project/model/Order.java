package com.syriamart.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "seller", "assignedDriver", "orderItems", "scanEvents"})
public class Order {
    @Id
    private String id;
    
    @Column(unique = true)
    private String qrTrackingToken;
    
    private String addressId;
    private String trackingNumber;
    private String pickupPointId;
    private String paymentMethod;
    private String paymentStatus;
    private String discountId;
    private String couponId;
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    @JsonIgnore
    private Seller seller;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_driver_id")
    @JsonIgnore
    private DeliveryProfile assignedDriver;
    
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;
    
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<ScanEvent> scanEvents;
    
    @PrePersist
    private void generateQrToken() {
        if (qrTrackingToken == null) {
            qrTrackingToken = UUID.randomUUID().toString();
        }
    }
}