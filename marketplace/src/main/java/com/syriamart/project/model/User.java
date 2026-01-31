package com.syriamart.project.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"addresses", "orders", "deliveryProfiles"})
public class User {
    @Id
    private String id;
    
    private String email;
    private String passwordHash;
    private String fullName;
    private String phone;
    private String addressId;
    private Boolean isActive;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime lastLogin;
    
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Address> addresses;
    
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
    
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<DeliveryProfile> deliveryProfiles;
}