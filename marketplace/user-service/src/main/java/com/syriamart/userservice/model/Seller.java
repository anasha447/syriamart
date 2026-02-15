package com.syriamart.userservice.model;

import com.syriamart.common.model.BaseEntity;
import com.syriamart.userservice.model.enums.SellerStatus;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sellers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Seller extends BaseEntity {

    @ToString.Include
    private Boolean adminApproved;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_admin_id")
    @JsonIgnore
    private Admin approvedByAdmin;

    @ToString.Include
    private String name;

    @ToString.Include
    private String email;

    private String passwordHash;
    private String phone;
    // private String addressId; // Removed as requested
    private String profileImageUrl;

    @ToString.Include
    private String storeName;

    @ToString.Include
    private String storeLocation;

    @ToString.Include
    private String productType;

    @Column(precision = 10, scale = 2)
    private BigDecimal profitPercentage;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private SellerStatus status;

    private LocalDateTime lastLogin;

    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Address> addresses;
}
