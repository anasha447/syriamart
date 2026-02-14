package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "warehouse_inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class WarehouseInventory extends BaseEntity {

    @ToString.Include
    private String productId;

    @ToString.Include
    private String warehouseId;

    @ToString.Include
    private Integer quantity;

    @ToString.Include
    private String shelfLocation;
}
