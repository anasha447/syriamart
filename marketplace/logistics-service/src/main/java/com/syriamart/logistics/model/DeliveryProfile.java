package com.syriamart.logistics.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.logistics.model.enums.VehicleType;
import com.syriamart.common.model.BaseEntity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "delivery_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class DeliveryProfile extends BaseEntity {

    @ToString.Include
    private String vehiclePlateNumber;

    @ToString.Include
    private BigDecimal currentLatitude;

    @ToString.Include
    private BigDecimal currentLongitude;

    @ToString.Include
    private Boolean isAvailable;

    @ToString.Include
    private BigDecimal rating;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private VehicleType vehicleType;

    @ToString.Include
    private String userId;

    @OneToMany(mappedBy = "deliveryProfile", fetch = FetchType.LAZY)
    private List<ScanEvent> scanEvents;

    @OneToMany(mappedBy = "assignedDriver", fetch = FetchType.LAZY)
    private List<ReturnRequest> returnRequests;
}
