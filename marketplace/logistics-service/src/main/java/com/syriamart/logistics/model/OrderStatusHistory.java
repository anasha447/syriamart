package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;
import com.syriamart.common.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Append-only log of every status transition for an order within the
 * logistics domain.
 *
 * Used by:
 *   – customer "track my order" timeline view
 *   – admin investigation / dispute resolution
 *   – SLA breach detection (time between status rows)
 */
@Entity
@Table(name = "order_status_history", indexes = {
        @Index(name = "idx_osh_order",      columnList = "order_id"),
        @Index(name = "idx_osh_changed_at", columnList = "changed_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusHistory extends BaseEntity {

    @Column(name = "order_id", nullable = false, length = 36)
    private String orderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 30)
    private OrderStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 30)
    private OrderStatus newStatus;

    /** "DRIVER" | "WAREHOUSE_STAFF" | "SYSTEM" | "ADMIN" */
    @Column(name = "changed_by_role", length = 30)
    private String changedByRole;

    /** UUID of the actor (driverId, staffId, etc.) who caused the transition. */
    @Column(name = "changed_by_id", length = 36)
    private String changedById;

    @Column(length = 500)
    private String notes;

    @Column(name = "changed_at", nullable = false)
    @Builder.Default
    private LocalDateTime changedAt = LocalDateTime.now();

    /** FK to the ScanEvent that triggered this transition (nullable for manual overrides). */
    @Column(name = "scan_event_id", length = 36)
    private String scanEventId;
}
