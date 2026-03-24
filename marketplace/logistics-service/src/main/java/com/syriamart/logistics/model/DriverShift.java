package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;
import com.syriamart.logistics.model.enums.ShiftStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a single working shift for a driver.
 * Created when a driver changes status to AVAILABLE and closed when OFFLINE.
 *
 * Used to:
 *  – calculate payout (deliveriesCompleted × ratePerDelivery)
 *  – generate the ShiftSummaryResponse
 *  – detect abnormally long open shifts (SLA monitoring)
 */
@Entity
@Table(name = "driver_shifts", indexes = {
        @Index(name = "idx_shift_driver", columnList = "driver_id"),
        @Index(name = "idx_shift_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverShift extends BaseEntity {

    @Column(name = "driver_id", nullable = false, length = 36)
    private String driverId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    @Builder.Default
    private ShiftStatus status = ShiftStatus.ACTIVE;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(name = "deliveries_completed", nullable = false)
    @Builder.Default
    private int deliveriesCompleted = 0;

    @Column(name = "deliveries_failed", nullable = false)
    @Builder.Default
    private int deliveriesFailed = 0;

    @Column(name = "returns_handled", nullable = false)
    @Builder.Default
    private int returnsHandled = 0;

    @Column(name = "total_distance_km", precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal totalDistanceKm = BigDecimal.ZERO;

    @Column(name = "shift_earnings", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal shiftEarnings = BigDecimal.ZERO;

    /** Human-readable note added by admin or auto-generated on close. */
    @Column(length = 500)
    private String summary;
}
