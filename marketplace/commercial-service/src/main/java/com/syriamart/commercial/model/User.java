package com.syriamart.commercial.model;

import com.syriamart.common.model.enums.UserRole; // Import from common-lib
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
@ToString(exclude = { "addresses", "orders" })
public class User {
    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    private String passwordHash;
    private String fullName;
    private String phone;
    private String addressId;
    private Boolean isActive;

    @Enumerated(EnumType.STRING) // IMPORTANT: Maps the Enum to a String in DB
    private UserRole role;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime lastLogin;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Address> addresses;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
}