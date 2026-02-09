package com.syriamart.commercial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.Comment;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_analytics")
@Comment("Materialized snapshot — do NOT query as live data")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "admin" })
public class AdminAnalytics {
    @Id
    private String id;

    private BigDecimal totalSales;

    @CreatedDate
    @Column(name = "computed_at", insertable = false, updatable = false)
    private LocalDateTime computedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    private Admin admin;
}