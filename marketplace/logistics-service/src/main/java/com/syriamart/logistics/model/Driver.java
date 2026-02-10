package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Driver extends BaseEntity {

    @ToString.Include
    private String fullName;

    @ToString.Include
    private String email;

    @ToString.Include
    private String phone;

    @ToString.Include
    private String status;

    @ToString.Include
    private Double currentRating;

    @ToString.Include
    private Integer totalDeliveries;
}
