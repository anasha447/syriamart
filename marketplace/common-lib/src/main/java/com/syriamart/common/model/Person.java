package com.syriamart.common.model;

import jakarta.persistence.MappedSuperclass;
import lombok.*;
import lombok.experimental.SuperBuilder;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(callSuper = true, onlyExplicitlyIncluded = true)
public abstract class Person extends BaseEntity {

    @ToString.Include
    private String fullName;

    @ToString.Include
    private String email;

    @ToString.Include
    private String phone;
}
