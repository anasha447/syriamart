package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * A physical locker or collection point where customers can pick up their
 * packages instead of home delivery.
 *
 * Capacity / occupancy tracking allows the warehouse to avoid assigning
 * orders to full pickup points.
 */
@Entity
@Table(name = "pickup_points", indexes = {
        @Index(name = "idx_pp_city",   columnList = "city"),
        @Index(name = "idx_pp_active", columnList = "active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PickupPoint extends BaseEntity {

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "address_line1", nullable = false, length = 200)
    private String addressLine1;

    @Column(name = "address_line2", length = 200)
    private String addressLine2;

    @Column(nullable = false, length = 80)
    private String city;

    @Column(nullable = false, length = 80)
    private String governorate;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "operating_hours", length = 100)
    private String operatingHours;

    @Column(name = "max_capacity", nullable = false)
    @Builder.Default
    private int maxCapacity = 50;

    @Column(name = "current_occupancy", nullable = false)
    @Builder.Default
    private int currentOccupancy = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    public boolean hasCapacity() {
        return currentOccupancy < maxCapacity;
    }
}
