package com.syriamart.logistics.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.common.model.BaseEntity;
import com.syriamart.logistics.model.enums.ReturnRequestStatus;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "return_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class ReturnRequest extends BaseEntity {

    @ToString.Include
    private String customerId;

    private String reason;

    @ToString.Include
    private BigDecimal refundAmount;

    private String proofImageUrl;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private ReturnRequestStatus status;

    @Column(name = "order_item_id")
    @ToString.Include
    private String orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_driver_id")
    @JsonIgnore
    private DeliveryProfile assignedDriver;
}
