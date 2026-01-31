package com.syriamart.project.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sellers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"addresses", "products", "orders"})
public class Seller {
    @Id
    private String id;
    
    private Boolean adminApproved;
    private String name;
    private String email;
    private String passwordHash;
    private String phone;
    private String addressId;
    private String profileImageUrl;
    private BigDecimal profitPercentage;
    
    @Enumerated(EnumType.STRING)
    private SellerStatus status;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime lastLogin;
    
    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Address> addresses;
    
    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Product> products;
    
    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Order> orders;
}