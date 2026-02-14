package com.syriamart.userservice.model;

import com.syriamart.common.model.BaseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syriamart.userservice.model.enums.AddressType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Address extends BaseEntity {

    @ToString.Include
    private String addressLine1;

    @ToString.Include
    private String addressLine2;

    @ToString.Include
    private String city;

    @ToString.Include
    private String state;

    @ToString.Include
    private String postalCode;

    @ToString.Include
    private String country;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private AddressType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    @JsonIgnore
    private Seller seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    private Admin admin;

    @PrePersist
    @PreUpdate
    private void validateOwner() {
        long count = java.util.stream.Stream.of(user, seller, admin)
                .filter(java.util.Objects::nonNull)
                .count();
        if (count != 1) {
            throw new IllegalStateException("Address must have exactly one owner (user, seller, or admin)");
        }
    }
}
