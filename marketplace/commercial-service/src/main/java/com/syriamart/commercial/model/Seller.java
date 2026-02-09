package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.commercial.model.enums.SellerStatus;
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
    private String addressId;
    private String profileImageUrl;

    @Column(precision = 10, scale = 2)
    private BigDecimal profitPercentage;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private SellerStatus status;

    private LocalDateTime lastLogin;

    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Address> addresses;

    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Product> products;

    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Order> orders;
}
