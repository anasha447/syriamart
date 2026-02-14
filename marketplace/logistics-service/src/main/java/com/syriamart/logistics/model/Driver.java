package com.syriamart.logistics.model;

import com.syriamart.common.model.Person;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Driver extends Person {

    @ToString.Include
    private String status;

    @ToString.Include
    private Double currentRating;

    @ToString.Include
    private Integer totalDeliveries;
}
