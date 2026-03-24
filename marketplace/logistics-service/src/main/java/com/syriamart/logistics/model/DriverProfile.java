package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;
import com.syriamart.logistics.model.enums.VehicleType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Extended profile information for a driver.
 * Kept in a separate table for cleaner queries — the main Driver entity
 * stays narrow and fast for dispatch lookups.
 */
@Entity
@Table(name = "driver_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "driver_id", nullable = false, unique = true)
    private Driver driver;

    // ── Vehicle info ──────────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, length = 15)
    private VehicleType vehicleType;

    @Column(name = "vehicle_make", length = 60)
    private String vehicleMake;

    @Column(name = "vehicle_model", length = 60)
    private String vehicleModel;

    @Column(name = "vehicle_year")
    private Integer vehicleYear;

    @Column(name = "vehicle_plate", unique = true, length = 20)
    private String vehiclePlate;

    @Column(name = "vehicle_color", length = 30)
    private String vehicleColor;

    // ── License ───────────────────────────────────────────────────────────────
    @Column(name = "license_number", unique = true, length = 40)
    private String licenseNumber;

    @Column(name = "license_expiry")
    private LocalDate licenseExpiry;

    @Column(name = "national_id", unique = true, length = 20)
    private String nationalId;

    // ── Profile photo ─────────────────────────────────────────────────────────
    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    // ── Bank / payout ─────────────────────────────────────────────────────────
    @Column(name = "bank_name", length = 80)
    private String bankName;

    @Column(name = "bank_account_number", length = 40)
    private String bankAccountNumber;

    @Column(name = "bank_account_name", length = 120)
    private String bankAccountName;

    // ── Performance counters (denormalized for fast dashboard queries) ─────────
    @Column(name = "total_deliveries", nullable = false)
    @Builder.Default
    private int totalDeliveries = 0;

    @Column(name = "successful_deliveries", nullable = false)
    @Builder.Default
    private int successfulDeliveries = 0;

    @Column(name = "failed_deliveries", nullable = false)
    @Builder.Default
    private int failedDeliveries = 0;

    @Column(name = "total_returns_handled", nullable = false)
    @Builder.Default
    private int totalReturnsHandled = 0;

    @Column(name = "average_rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "total_earnings", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(name = "pending_payout", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal pendingPayout = BigDecimal.ZERO;

    public double successRate() {
        if (totalDeliveries == 0) return 0.0;
        return (double) successfulDeliveries / totalDeliveries * 100.0;
    }
}
