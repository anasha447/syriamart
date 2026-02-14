package com.syriamart.userservice.model;

import com.syriamart.common.model.Person;
import com.syriamart.common.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
@AttributeOverride(name = "email", column = @Column(name = "email", unique = true, nullable = false))
public class User extends Person {

    private String passwordHash;

    private String addressId;

    @ToString.Include
    private Boolean isActive;

    @Enumerated(EnumType.STRING)
    @ToString.Include
    private UserRole role;

    private LocalDateTime lastLogin;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Address> addresses;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
}
