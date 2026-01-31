package com.syriamart.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@ToString(exclude = {"user", "assignedOrders", "scanEvents", "returnRequests"})
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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    
    @OneToMany(mappedBy = "assignedDriver", fetch = FetchType.LAZY)
    private List<Order> assignedOrders;
    
    @OneToMany(mappedBy = "deliveryProfile", fetch = FetchType.LAZY)
    private List<ScanEvent> scanEvents;
    
    @OneToMany(mappedBy = "assignedDriver", fetch = FetchType.LAZY)
    private List<ReturnRequest> returnRequests;
}