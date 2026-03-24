package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;
import com.syriamart.logistics.model.enums.ScanEventType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * An immutable record of every scan that occurred on a package during its
 * logistics lifecycle.
 *
 * orderId  – references the Order in commercial-service (no FK).
 * driverId – null for warehouse-only scans (inbound/outbound).
 *
 * This is the source of truth for customer-facing "track my order" queries.
 */
@Entity
@Table(name = "scan_events", indexes = {
        @Index(name = "idx_scan_order",     columnList = "order_id"),
        @Index(name = "idx_scan_driver",    columnList = "driver_id"),
        @Index(name = "idx_scan_type",      columnList = "event_type"),
        @Index(name = "idx_scan_scanned_at",columnList = "scanned_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScanEvent extends BaseEntity {

    /** UUID of the order being scanned — foreign ref into commercial-service. */
    @Column(name = "order_id", nullable = false, length = 36)
    private String orderId;

    /** UUID of the driver who scanned — null for warehouse staff scans. */
    @Column(name = "driver_id", length = 36)
    private String driverId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 25)
    private ScanEventType eventType;

    /** Human-readable location description (e.g. "Damascus Warehouse – Gate 3"). */
    @Column(nullable = false, length = 200)
    private String location;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    /** Optional QR or barcode value that was scanned. */
    @Column(name = "scan_code", length = 120)
    private String scanCode;

    /** Any note the driver or warehouse staff attached at scan time. */
    @Column(length = 500)
    private String notes;

    /**
     * The exact moment the scan occurred.
     * Using a dedicated field (not createdAt) so it can be set retroactively
     * if a sync delay occurred in an offline-capable driver app.
     */
    @Column(name = "scanned_at", nullable = false)
    @Builder.Default
    private LocalDateTime scannedAt = LocalDateTime.now();
}
