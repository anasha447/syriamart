package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Tracks the physical presence of an order's package inside the warehouse.
 *
 * One record per orderId. Status lifecycle:
 *   RECEIVED → PROCESSING → DISPATCHED → (RETURNED_RECEIVED when applicable)
 *
 * binLocation – the physical shelf/bin code (e.g. "A-03-12").
 */
@Entity
@Table(name = "warehouse_inventory", indexes = {
        @Index(name = "idx_wi_order",    columnList = "order_id", unique = true),
        @Index(name = "idx_wi_status",   columnList = "status"),
        @Index(name = "idx_wi_bin",      columnList = "bin_location")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseInventory extends BaseEntity {

    @Column(name = "order_id", nullable = false, unique = true, length = 36)
    private String orderId;

    /** UUID of the seller who shipped this package in. */
    @Column(name = "seller_id", nullable = false, length = 36)
    private String sellerId;

    /**
     * Warehouse lifecycle status.
     * RECEIVED           – Package physically arrived.
     * PROCESSING         – Being sorted / labeled.
     * READY_FOR_DISPATCH – Sorted, awaiting driver assignment.
     * DISPATCHED         – Handed off to a driver.
     * RETURNED_RECEIVED  – Returned package arrived back.
     * DISPOSED           – Irreparably damaged / administratively closed.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    @Builder.Default
    private WarehouseStatus status = WarehouseStatus.RECEIVED;

    @Column(name = "bin_location", length = 20)
    private String binLocation;

    /** ID of the ScanEvent that logged the inbound arrival. */
    @Column(name = "inbound_scan_event_id", length = 36)
    private String inboundScanEventId;

    /** ID of the ScanEvent that logged the outbound dispatch. */
    @Column(name = "outbound_scan_event_id", length = 36)
    private String outboundScanEventId;

    /** Driver assigned to deliver this package. */
    @Column(name = "assigned_driver_id", length = 36)
    private String assignedDriverId;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;

    @Column(name = "dispatched_at")
    private LocalDateTime dispatchedAt;

    @Column(length = 500)
    private String notes;

    public enum WarehouseStatus {
        RECEIVED, PROCESSING, READY_FOR_DISPATCH, DISPATCHED, RETURNED_RECEIVED, DISPOSED
    }
}
