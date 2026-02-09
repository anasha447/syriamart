package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.commercial.model.enums.SellerStatus;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sellers")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "addresses", "products", "orders" })
public class Seller {
    @Id
    private String id;

    // Keep boolean flag
    private Boolean adminApproved;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_admin_id")
    @JsonIgnore
    private Admin approvedByAdmin;
    private String name;
    private String email;
    private String passwordHash;
    private String phone;
    private String addressId;
    private String profileImageUrl;

    @Column(precision = 10, scale = 2)
    private BigDecimal profitPercentage;

    @Enumerated(EnumType.STRING)
    private SellerStatus status;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastLogin;

    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Address> addresses;

    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Product> products;

    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Order> orders;
}