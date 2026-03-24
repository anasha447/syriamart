package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;
import com.syriamart.logistics.model.enums.DriverStatus;
import jakarta.persistence.*;
import lombok.*;

/**
 * Authentication & identity record for a driver.
 *
 * Drivers authenticate against THIS service using their own JWT flow
 * (separate from the user-service). The Driver entity stores credentials
 * and the current operational status.
 *
 * adminId – UUID of the admin (from user-service) who registered this driver.
 * The profile details (vehicle, license, etc.) live in DriverProfile (1:1).
 */
@Entity
@Table(name = "drivers", indexes = {
        @Index(name = "idx_driver_email",  columnList = "email",  unique = true),
        @Index(name = "idx_driver_phone",  columnList = "phone",  unique = true),
        @Index(name = "idx_driver_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver extends BaseEntity {

    @Column(nullable = false, length = 80)
    private String firstName;

    @Column(nullable = false, length = 80)
    private String lastName;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    /** BCrypt-hashed password. */
    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private DriverStatus status = DriverStatus.OFFLINE;

    /** UUID of the admin who registered this driver (from user-service). */
    @Column(name = "registered_by_admin_id", nullable = false, length = 36)
    private String registeredByAdminId;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    /** Current GPS latitude — updated by the driver app on every location ping. */
    @Column(name = "current_latitude", precision = 10)
    private Double currentLatitude;

    /** Current GPS longitude. */
    @Column(name = "current_longitude", precision = 10)
    private Double currentLongitude;

    @Column(name = "last_location_update")
    private java.time.LocalDateTime lastLocationUpdate;

    @OneToOne(mappedBy = "driver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private DriverProfile profile;

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
