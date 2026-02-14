package com.syriamart.logistics.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.common.model.BaseEntity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "scan_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class ScanEvent extends BaseEntity {

    @ToString.Include
    private String scannedByUserId;

    @ToString.Include
    private BigDecimal scanLocationLat;

    @ToString.Include
    private BigDecimal scanLocationLong;

    @ToString.Include
    private String previousStatus;

    @ToString.Include
    private String newStatus;

    @Column(name = "order_id")
    @ToString.Include
    private String orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_profile_id")
    @JsonIgnore
    private DeliveryProfile deliveryProfile;
}
