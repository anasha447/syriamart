package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "pickup_points")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class PickupPoint extends BaseEntity {

    @ToString.Include
    private String name;

    private String addressId;

    @ToString.Include
    private String sellerId;
}
