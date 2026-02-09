package com.syriamart.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.project.model.enums.VehicleType;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "delivery_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "scanEvents", "returnRequests" })
public class DeliveryProfile {
    @Id
    private String id;

    private String vehiclePlateNumber;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
    private Boolean isAvailable;
    private BigDecimal rating;

    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    private String userId;

    @OneToMany(mappedBy = "deliveryProfile", fetch = FetchType.LAZY)
    private List<ScanEvent> scanEvents;

    @OneToMany(mappedBy = "assignedDriver", fetch = FetchType.LAZY)
    private List<ReturnRequest> returnRequests;
}