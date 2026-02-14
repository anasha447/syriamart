package com.syriamart.userservice.model;

import com.syriamart.common.model.BaseEntity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Admin extends BaseEntity {

    @ToString.Include
    private String username;

    @ToString.Include
    private String email;

    private String passwordHash;

    @ToString.Include
    private String fullName;

    private LocalDateTime lastLogin;

    @OneToMany(mappedBy = "admin", fetch = FetchType.LAZY)
    private List<Address> addresses;
}
