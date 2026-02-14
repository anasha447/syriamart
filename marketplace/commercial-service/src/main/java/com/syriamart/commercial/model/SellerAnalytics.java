package com.syriamart.commercial.model;

import com.syriamart.common.model.BaseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "seller_analytics")
@Comment("Materialized snapshot — do NOT query as live data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class SellerAnalytics extends BaseEntity {

    @ToString.Include
    private BigDecimal totalSales;

    @ToString.Include
    private Integer totalOrders;

    @Column(name = "seller_id")
    private String sellerId;
}
