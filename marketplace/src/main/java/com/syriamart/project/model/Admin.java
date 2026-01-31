package com.syriamart.project.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"addresses"})
public class Admin {
    @Id
    private String id;
    
    private String username;
    private String email;
    private String passwordHash;
    private String fullName;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime lastLogin;
    
    @OneToMany(mappedBy = "admin", fetch = FetchType.LAZY)
    private List<Address> addresses;
}