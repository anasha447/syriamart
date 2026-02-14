package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.common.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Order extends BaseEntity {

    @Column(unique = true)
    @ToString.Include
    private String qrTrackingToken;

    @Column(name = "qr_id", unique = true)
    @ToString.Include
    private String qrId;

    private String addressId;

    @ToString.Include
    private String trackingNumber;

    private String pickupPointId;
    private String paymentMethod;

    @ToString.Include
    private String paymentStatus;

    private String discountId;
    private String couponId;

    @Column(precision = 10, scale = 2)
    @ToString.Include
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private OrderStatus status;

    private String userId;

    private String sellerId;

    @Column(name = "assigned_driver_id")
    private String assignedDriverId;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    @PrePersist
    private void ensureIdentifiers() {
        if (this.qrTrackingToken == null) {
            this.qrTrackingToken = UUID.randomUUID().toString();
        }
        if (this.qrId == null) {
            this.qrId = UUID.randomUUID().toString();
        }
    }
}
