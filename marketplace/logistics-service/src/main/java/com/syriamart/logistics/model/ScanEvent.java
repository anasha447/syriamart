package com.syriamart.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "scan_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "deliveryProfile" })
public class ScanEvent {
    @Id
    private String id;

    private String scannedByUserId;
    private BigDecimal scanLocationLat;
    private BigDecimal scanLocationLong;
    private String previousStatus;
    private String newStatus;

    @CreationTimestamp
    private LocalDateTime scannedAt;

    @Column(name = "order_id")
    private String orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_profile_id")
    @JsonIgnore
    private DeliveryProfile deliveryProfile;
}