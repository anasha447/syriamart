package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.commercial.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "user", "seller", "orderItems" })
public class Order {
    @Id
    private String id;

    @Column(unique = true)
    private String qrTrackingToken;

    @Column(name = "qr_id", unique = true)
    private String qrId;

    private String addressId;
    private String trackingNumber;
    private String pickupPointId;
    private String paymentMethod;
    private String paymentStatus;
    private String discountId;
    private String couponId;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    @JsonIgnore
    private Seller seller;

    @Column(name = "assigned_driver_id")
    private String assignedDriverId;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    // Fixed: Combined all pre-persist logic into one method
    @PrePersist
    private void ensureIdentifiers() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.qrTrackingToken == null) {
            this.qrTrackingToken = UUID.randomUUID().toString();
        }
        if (this.qrId == null) {
            this.qrId = UUID.randomUUID().toString();
        }
    }
}