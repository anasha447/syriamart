package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;
import com.syriamart.logistics.model.enums.ReturnRequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * A customer-initiated return request for a delivered order item.
 *
 * customerId   – UUID from user-service.
 * orderItemId  – UUID of the specific OrderItem being returned (from commercial-service).
 * orderId      – Parent order UUID for easy lookups.
 * assignedDriverId – The driver assigned to pick up the return (nullable until assigned).
 */
@Entity
@Table(name = "return_requests", indexes = {
        @Index(name = "idx_rr_order",       columnList = "order_id"),
        @Index(name = "idx_rr_customer",    columnList = "customer_id"),
        @Index(name = "idx_rr_order_item",  columnList = "order_item_id", unique = true),
        @Index(name = "idx_rr_status",      columnList = "status"),
        @Index(name = "idx_rr_driver",      columnList = "assigned_driver_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnRequest extends BaseEntity {

    @Column(name = "order_id", nullable = false, length = 36)
    private String orderId;

    @Column(name = "order_item_id", nullable = false, unique = true, length = 36)
    private String orderItemId;

    @Column(name = "customer_id", nullable = false, length = 36)
    private String customerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ReturnRequestStatus status = ReturnRequestStatus.PENDING;

    @Column(name = "reason", nullable = false, length = 500)
    private String reason;

    @Column(name = "customer_notes", length = 1000)
    private String customerNotes;

    @Column(name = "admin_notes", length = 1000)
    private String adminNotes;

    /** Image URL of the proof photo uploaded by the customer. */
    @Column(name = "proof_image_url")
    private String proofImageUrl;

    @Column(name = "assigned_driver_id", length = 36)
    private String assignedDriverId;

    @Column(name = "pickup_scheduled_at")
    private LocalDateTime pickupScheduledAt;

    @Column(name = "picked_up_at")
    private LocalDateTime pickedUpAt;

    @Column(name = "received_at_warehouse_at")
    private LocalDateTime receivedAtWarehouseAt;

    @Column(name = "refund_amount")
    private java.math.BigDecimal refundAmount;

    @Column(name = "refund_initiated_at")
    private LocalDateTime refundInitiatedAt;
}
